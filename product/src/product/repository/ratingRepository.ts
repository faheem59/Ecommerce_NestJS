import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from '../entities/rating.entity';
import { Repository } from 'typeorm';
import { RatingDto } from '../dto/rating.dto';
import { RedisClientService } from 'src/config/redisClient/redis.service';
import { ERROR_MESSAGES } from '../utils/constants/Error.message';
import { Common } from '../utils/constants/commom.constant';

@Injectable()
export class RatingRepository {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    private readonly redisClient: RedisClientService,
  ) {}

  async addRating(ratingData: RatingDto): Promise<Rating> {
    const userData = await this.redisClient.getValue(Common.USER);
    if (!userData) {
      throw new NotFoundException(ERROR_MESSAGES.USER_DATA_NOT_FOUND);
    }

    const rating = this.ratingRepository.create({
      ...ratingData,
      user: {
        id: userData.id,
        name: userData.name,
      },
    });

    return await this.ratingRepository.save(rating);
  }
}
