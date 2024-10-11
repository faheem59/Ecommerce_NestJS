import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4;

  @Column({ type: 'text' })
  content: string;

  @Column('jsonb')
  user: {
    id: string;
    name: string;
  };

  @ManyToOne(() => Product, (product) => product.comments)
  product: Product;
}
