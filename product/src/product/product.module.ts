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
import { RabbitmqModule } from 'src/config/rabbitmq/rabbitmq.module';
import { RedisClientService } from 'src/config/redisClient/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Rating, Comment, Category]),
    RabbitmqModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    CloudinaryService,
    CategoryRepository,
    RedisClientService,
  ],
})
export class ProductModule {}
