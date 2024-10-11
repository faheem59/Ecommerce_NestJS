import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from './config/rabbitmq/rabbitmq.module';
import { RedisClientModule } from './config/redisClient/redis.module';

@Module({
  imports: [
    ProductModule,
    DatabaseModule,
    RabbitmqModule,
    RedisClientModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
