import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCategoryDto } from './dto/category-dto';
import { Category } from './entities/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('get_product')
  async getProduct(productId: string) {
    const id = await this.productService.findOne(productId);
    return id;
  }

  @MessagePattern('update_product_quantity')
  async updateProductQuantity(data: { productId: string; quantity: number }) {
    return await this.productService.updateProductQuantity(data);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.productService.create(createProductDto, file);
  }
  @Get('categories')
  findCate() {
    return this.productService.getCategory();
  }

  @Post('categories')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.productService.createCategory(createCategoryDto);
  }

  @Get('with-subcategories')
  async getCategoriesWithSubcategories(): Promise<Category[]> {
    return this.productService.findAllWithSubcategories();
  }
  @Get()
  findAllProduct() {
    return this.productService.findAllProduct();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch('/updateproduct/:id')
  update(@Param('id') id: string, @Body() updateProductData: UpdateProductDto) {
    return this.productService.updateProduct(id, updateProductData);
  }

  @Delete('deleteproduct/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
