import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderRepository } from './repository/order.repository';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  create(createOrderDto: CreateOrderDto) {
    return this.orderRepository.createOrder(createOrderDto);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.findAllOrder();
  }

  async findOne(id: string): Promise<Order> {
    return await this.orderRepository.findOrderById(id);
  }

  async updateOrderStatus(id: string, newStatus: string) {
    return await this.orderRepository.updateOrderStatus(id, newStatus);
  }

  async cancelOrder(id: string) {
    return await this.orderRepository.cancelOrder(id);
  }
}
