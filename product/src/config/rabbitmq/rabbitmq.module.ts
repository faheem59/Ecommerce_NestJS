import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'product_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'ORDER_RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'order_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
