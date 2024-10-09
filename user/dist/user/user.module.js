"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_repository_1 = require("./repositories/user-repository");
const role_entity_1 = require("./entities/role.entity");
const permission_entity_1 = require("./entities/permission.entity");
const permssion_repository_1 = require("./repositories/permssion-repository");
const refreshToken_entity_1 = require("./entities/refreshToken.entity");
const client_service_1 = require("../redisClient/client.service");
const mail_service_1 = require("../mail/mail.service");
const refreshToken_repository_1 = require("./repositories/refreshToken-repository");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, role_entity_1.RoleEntity, permission_entity_1.Permission, refreshToken_entity_1.RefreshToken]),
        ],
        providers: [
            user_repository_1.UserRepository,
            permssion_repository_1.PermissionRepository,
            refreshToken_repository_1.RefreshTokenRepository,
            user_service_1.UserService,
            client_service_1.ClientService,
            mail_service_1.MailService,
        ],
        controllers: [user_controller_1.UserController],
        exports: [
            user_repository_1.UserRepository,
            permssion_repository_1.PermissionRepository,
            refreshToken_repository_1.RefreshTokenRepository,
            typeorm_1.TypeOrmModule,
        ],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map