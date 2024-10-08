import { IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsOptional()
  parentCategoryId?: string;
}
