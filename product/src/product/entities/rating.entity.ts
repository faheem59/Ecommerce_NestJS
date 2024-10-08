import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { v4 as uuidv4 } from 'uuid';
@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'numeric' })
  numOfReviews: number;

  @Column({ type: 'numeric' })
  avgRating: number;

  @ManyToOne(() => Product, (product) => product.rating)
  products: Product[];
}
