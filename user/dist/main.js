"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./utils/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: "localhost",
            port: 3003,
        },
    });
    const httpApp = await core_1.NestFactory.create(app_module_1.AppModule);
    httpApp.enableCors({
        origin: "http://127.0.0.1:5500",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    });
    httpApp.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    httpApp.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    httpApp.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    await httpApp.listen(3002);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map