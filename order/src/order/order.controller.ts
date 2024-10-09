import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('product_created')
  async handleProductCreated(data: any) {
    console.log('Received product data:', data);
  }
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, newStatus: string) {
    return await this.orderService.updateOrderStatus(id, newStatus);
  }

  @Patch(':id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return await this.orderService.cancelOrder(id);
  }
}
