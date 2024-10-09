import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order.item.dto';

class ShippingInfoDto {
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsNumber()
  pinCode: number;

  @IsNotEmpty()
  @IsString()
  phoneNo: string;
}

class PaymentInfoDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsObject()
  @Type(() => ShippingInfoDto)
  shippingInfo: ShippingInfoDto;

  @IsArray()
  @Type(() => OrderItemDto) // Assuming you have an OrderItemDto defined
  orderItems: OrderItemDto[];

  @IsNotEmpty()
  @IsObject()
  @Type(() => PaymentInfoDto)
  paymentInfo: PaymentInfoDto;

  @IsNotEmpty()
  @IsDate()
  paidAt: Date;

  @IsNotEmpty()
  @IsNumber()
  itemsPrice: number;

  @IsNotEmpty()
  @IsNumber()
  taxPrice: number;

  @IsNotEmpty()
  @IsNumber()
  shippingPrice: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  orderStatus: string;

  @IsOptional()
  @IsDate()
  deliveredAt?: Date;
}
