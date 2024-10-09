import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  constructor(
    @Inject('PRODUCT_RABBITMQ_CLIENT')
    private readonly rabbimqClient: ClientProxy,
  ) {}

  async sendMessage(pattern: string, data: any) {
    return this.rabbimqClient.emit(pattern, data);
  }

  async sendProduct(pattern: string, data: any) {
    return this.rabbimqClient.send(pattern, data);
  }
}
