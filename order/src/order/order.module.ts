import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RabbitmqModule } from 'src/config/rabbitmq/rabbitmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { OrderRepository } from './repository/order.repository';
import { RedisClientService } from 'src/config/redisClient/redis.service';
// import { RabbitmqService } from 'src/config/rabbitmq/rabbitmq.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), RabbitmqModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, RedisClientService],
})
export class OrderModule {}
