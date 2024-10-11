import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  constructor(
    @Inject('PAYMENT_RABBITMQ_CLIENT')
    private readonly paymentClient: ClientProxy,
    @Inject('PRODUCT_RABBITMQ_CLIENT')
    private readonly productClient: ClientProxy,
  ) {}

  async sendMessage(pattern: string, data: any) {
    return this.paymentClient.send(pattern, data);
  }

  async sendProduct(pattern: string, data: any) {
    return this.productClient.send(pattern, data);
  }
}
