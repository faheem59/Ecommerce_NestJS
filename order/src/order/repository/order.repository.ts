import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RabbitmqService } from 'src/config/rabbitmq/rabbitmq.service';
import { Order } from '../entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { OrderItem } from '../entities/orderItem.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { RedisClientService } from 'src/config/redisClient/redis.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OrderRepository {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly redisClient: RedisClientService,
    private readonly httpService: HttpService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const orderItems: OrderItem[] = [];
    const userData = await this.redisClient.getValue('user');
    console.log('user', userData);

    if (!userData) {
      throw new NotFoundException('User data not found in Redis');
    }

    for (const item of createOrderDto.orderItems) {
      const productData = await (
        await this.rabbitmqService.sendProduct('get_product', item.productId)
      ).toPromise();
      console.log('Product data:', productData);
      if (productData) {
        const orderItem = new OrderItem();
        orderItem.name = productData.name;
        orderItem.price = productData.price;
        orderItem.quantity = item.quantity;
        orderItem.image = productData.image;
        orderItem.productId = item.productId;
        orderItems.push(orderItem);
      }
    }

    // Handle payment information
    let paymentInfo;
    if (createOrderDto.paymentMethod === 'stripe') {
      try {
        const paymentResponse = await (
          await this.rabbitmqService.sendMessage(
            'payment.create-payment-intent',
            {
              amount: createOrderDto.totalPrice,
            },
          )
        ).toPromise();
        const { id: paymentIntentId, status } = paymentResponse;
        paymentInfo = {
          id: paymentIntentId,
          status: status || 'Payment Pending',
        };
      } catch (error) {
        console.error('Error sending payment request:', error);
        throw new InternalServerErrorException(
          'Failed to create payment intent',
        );
      }
    } else if (createOrderDto.paymentMethod === 'cod') {
      paymentInfo = {
        id: null,
        status: 'Cash on Delivery',
      };
    } else {
      throw new InternalServerErrorException('Invalid payment method');
    }

    const order = this.orderRepository.create({
      ...createOrderDto,
      orderItems,
      user: {
        id: userData.id,
        name: userData.name,
      },
      paymentInfo,
    });

    await this.orderRepository.save(order);
    return order;
  }

  async findAllOrder(): Promise<Order[]> {
    return await this.orderRepository.find();
  }
  async findOrderById(id: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order) {
        throw new NotFoundException('Order Not FOund');
      }
      return order;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateOrderStatus(orderId: string, newStatus: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Order Not Found');
      }
      order.orderStatus = newStatus;

      return await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async cancelOrder(orderId: string): Promise<void> {
    return await this.orderRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const order = await entityManager.findOne(Order, {
          where: { id: orderId },
          relations: ['orderItems'],
        });

        if (!order) {
          throw new NotFoundException('Order Not Found');
        }

        if (order.orderStatus === 'Cancelled') {
          throw new InternalServerErrorException('Order already canceled');
        }

        for (const item of order.orderItems) {
          const productData = await (
            await this.rabbitmqService.sendProduct(
              'get_product',
              item.productId,
            )
          ).toPromise();

          if (productData) {
            const newQuantity = productData.quantity + item.quantity;

            await this.rabbitmqService.sendMessage('update_product_quantity', {
              productId: item.productId,
              quantity: newQuantity,
            });
          }
        }
        order.orderStatus = 'Cancelled';
        await entityManager.save(order);
      },
    );
  }
}
