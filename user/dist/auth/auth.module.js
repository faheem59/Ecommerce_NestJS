"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_module_1 = require("../user/user.module");
const core_1 = require("@nestjs/core");
const auth_gaurd_1 = require("./guard/auth.gaurd");
const role_gaurd_1 = require("./guard/role.gaurd");
const client_service_1 = require("../redisClient/client.service");
const rabbitmq_module_1 = require("../rabbitmq/rabbitmq.module");
const user_service_1 = require("../user/user.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: "jwt" }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get("JWT_SECRET"),
                    signOptions: {
                        expiresIn: config.get("JWT_EXPIRES"),
                    },
                }),
            }),
            user_module_1.UserModule,
            rabbitmq_module_1.RabbitmqModule,
            config_1.ConfigModule.forRoot(),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            client_service_1.ClientService,
            user_service_1.UserService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_gaurd_1.AuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: role_gaurd_1.RolesGuard,
            },
        ],
        exports: [passport_1.PassportModule, auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map