import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from '../entities/rating.entity';
import { Repository } from 'typeorm';
import { RatingDto } from '../dto/rating.dto';

@Injectable()
export class RatingRepository {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async addRating(ratingData: RatingDto): Promise<Rating> {
    const rating = this.ratingRepository.create(ratingData);

    return await this.ratingRepository.save(rating);
  }
}
