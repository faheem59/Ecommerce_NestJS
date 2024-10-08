import { IsNumber } from 'class-validator';

export class RatingDto {
  @IsNumber()
  numofReviews: number;

  @IsNumber()
  avgRating: number;
}
