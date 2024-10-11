import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';
import { CategoryRepository } from './categoryRepository';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryRepository: CategoryRepository,
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

  async findAllProduct(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findProductById(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException('Not Found');
      }

      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async update(id: string, updateData: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.update(id, updateData);

    return this.productRepository.findOne({ where: { id } });
  }

  async deleteProduct(id: string): Promise<string> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    await this.productRepository.softDelete(id);

    return 'Product deleted succeddfully';
  }

  async updateProductQuantity(data: { productId: string; quantity: number }) {
    const product = await this.productRepository.findOne({
      where: { id: data.productId },
    });

    if (product) {
      product.quantity = data.quantity;
      await this.productRepository.save(product);
    }
  }
}
