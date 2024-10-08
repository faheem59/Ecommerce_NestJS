import {
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  Entity,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Rating } from './rating.entity';
import { Comment } from './comment.entity';
import { v4 as uuidv4 } from 'uuid';
import { Exclude } from 'class-transformer';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'varchar', length: '255' })
  name: string;

  @Column('jsonb', { nullable: true })
  poster: { public_id?: string; url?: string } | null;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'numeric' })
  quantity: number;

  @OneToMany(() => Rating, (rating) => rating.products)
  rating: Rating[];

  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
