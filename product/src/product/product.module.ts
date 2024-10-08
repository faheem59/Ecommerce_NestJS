import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Rating } from './entities/rating.entity';
import { Category } from './entities/category.entity';
import { ProductRepository } from './repository/productRepostiry';
import { Comment } from './entities/comment.entity';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';
import { CategoryRepository } from './repository/categoryRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Rating, Comment, Category])],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    CloudinaryService,
    CategoryRepository,
  ],
})
export class ProductModule {}
