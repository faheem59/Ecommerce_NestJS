import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  productId: string;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
}
