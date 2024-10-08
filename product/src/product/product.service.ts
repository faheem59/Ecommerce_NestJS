import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repository/productRepostiry';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/category-dto';
import { CategoryRepository } from './repository/categoryRepository';
import { UpdateProductDto } from './dto/update-product.dto';

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
  async findAllProduct() {
    return await this.productRepositroy.findAllProduct();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepositroy.findProductById(id);
    return product;
  }

  async updateProduct(
    id: string,
    updatedata: UpdateProductDto,
  ): Promise<Product> {
    return await this.productRepositroy.update(id, updatedata);
  }

  async deleteProduct(id: string) {
    return await this.productRepositroy.deleteProduct(id);
  }

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.createCategory(categoryData);
  }

  async findAllWithSubcategories(): Promise<Category[]> {
    return await this.categoryRepository.findAllWithSubcategories();
  }
}
