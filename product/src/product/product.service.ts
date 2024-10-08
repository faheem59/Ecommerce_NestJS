import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repository/productRepostiry';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/category-dto';
import { CategoryRepository } from './repository/categoryRepository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepositroy: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(
    productData: CreateProductDto,
    file: Express.Multer.File,
  ): Promise<Product> {
    return await this.productRepositroy.createProduct(productData, file);
  }

  async getCategory(): Promise<Category[]> {
    return await this.categoryRepository.getCategory();
  }
  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.createCategory(categoryData);
  }

  async findAllWithSubcategories(): Promise<Category[]> {
    return await this.categoryRepository.findAllWithSubcategories();
  }
}
