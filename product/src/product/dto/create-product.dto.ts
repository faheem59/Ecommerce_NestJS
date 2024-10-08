import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsObject()
  @IsNotEmpty()
  poster: { public_id: string; url: string };

  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  categoryIds: string[];

  @IsOptional()
  ratingId?: number; // Assuming Rating has an ID

  @IsOptional()
  commentId?: number; // Assuming Comment has an ID
}
