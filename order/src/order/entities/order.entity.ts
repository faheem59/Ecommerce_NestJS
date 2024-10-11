import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  shippingInfo: {
    name?: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
    phoneNo: string;
  };

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @Column('jsonb')
  user: {
    id: string;
    name: string;
  };

  @Column('jsonb')
  paymentInfo: {
    id: string;
    status: string;
  };

  @Column()
  paidAt: Date;

  @Column({ default: 0 })
  itemsPrice: number;

  @Column({ default: 0 })
  taxPrice: number;

  @Column({ default: 0 })
  shippingPrice: number;

  @Column()
  paymentMethod: 'stripe' | 'cod';

  @Column()
  totalPrice: number;

  @Column({ default: 'Processing' })
  orderStatus: string;

  @Column({ nullable: true })
  deliveredAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
