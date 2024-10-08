import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/category-dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);

    if (categoryData.parentCategoryId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: categoryData.parentCategoryId },
      });

      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with ID ${categoryData.parentCategoryId} not found`,
        );
      }
      category.parentCategory = parentCategory;
    }

    return await this.categoryRepository.save(category);
  }

  async findAllWithSubcategories(): Promise<Category[]> {
    return await this.categoryRepository.find({ relations: ['subcategories'] });
  }
  async getCategory(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findByIds(categoryIds: string[]): Promise<Category[]> {
    const categories = await this.categoryRepository.findByIds(categoryIds);

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories not found');
    }

    return categories;
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }
}
