import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { HttpExceptionFilter } from "./utils/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: "localhost",
        port: 3003,
      },
    },
  );

  const httpApp = await NestFactory.create(AppModule);

  httpApp.enableCors({
    origin: "http://127.0.0.1:5500", // Adjust this to your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  httpApp.enableVersioning({
    type: VersioningType.URI,
  });

  httpApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  httpApp.useGlobalFilters(new HttpExceptionFilter());

  await httpApp.listen(3002);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen();
}
bootstrap();
