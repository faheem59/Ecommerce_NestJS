import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from '../entities/rating.entity';
import { Comment } from '../entities/comment.entity';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';
import { CategoryRepository } from './categoryRepository';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createProduct(
    productData: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<Product> {
    try {
      const publicId = productData.poster?.public_id || `course_${Date.now()}`;
      if (!file) {
        throw new NotFoundException('File Not Found');
      }

      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        publicId,
      );

      const product = this.productRepository.create({
        ...productData,
        poster: {
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
        },
      });

      const categories = await this.categoryRepository.findByIds(
        productData.categoryIds,
      );
      product.categories = categories;

      await this.productRepository.save(product);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
