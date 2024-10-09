import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './config/database/database.module';
import { RabbitmqModule } from './config/rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';
import { RedisClientModule } from './config/redisClient/redis.module';

@Module({
  imports: [
    OrderModule,
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
