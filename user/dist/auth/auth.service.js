"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const success_messges_1 = require("../utils/success-messges");
const error_messages_1 = require("../utils/error-messages");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("../user/entities/user.entity");
const permission_enum_1 = require("../enum/permission-enum");
const client_service_1 = require("../redisClient/client.service");
const rabbitmq_service_1 = require("../rabbitmq/rabbitmq.service");
const user_service_1 = require("../user/user.service");
const common_enum_1 = require("../enum/common-enum");
let AuthService = class AuthService {
    constructor(userService, jwtService, cacheService, rabbitmqService, reddisService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.cacheService = cacheService;
        this.rabbitmqService = rabbitmqService;
        this.reddisService = reddisService;
    }
    async createUser(userData) {
        try {
            const userResponse = await this.userService.create(userData);
            const user = userResponse.user;
            await this.rabbitmqService.sendMessage(common_enum_1.Common.USER_CREATED, (0, class_transformer_1.plainToClass)(user_entity_1.User, user));
            return {
                message: success_messges_1.SUCCESS_MESSAGES.USER_CREATED,
                user: (0, class_transformer_1.plainToClass)(user_entity_1.User, user),
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async createAdmin(adminData) {
        try {
            const adminResponse = await this.userService.createAdmin(adminData);
            const admin = adminResponse.user;
            await this.rabbitmqService.sendMessage(common_enum_1.Common.ADMIN_CREATED, (0, class_transformer_1.plainToClass)(user_entity_1.User, admin));
            return {
                message: success_messges_1.SUCCESS_MESSAGES.ADMIN_CREATED,
                user: (0, class_transformer_1.plainToClass)(user_entity_1.User, admin),
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async validateUser(userData) {
        const { email, password } = userData;
        try {
            const userResponse = await this.userService.findOneEmail(email);
            const user = userResponse.user;
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.INVALID_CREDENTIALS);
            }
            if (user.status === permission_enum_1.UserStatus.INACTIVE) {
                throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.USER_INACTIVE);
            }
            await this.userService.findTokenById(user.id);
            const newToken = await this.generateRefereshtoken(user.id);
            await this.userService.saveUpdateToken(user.id, newToken);
            const accessToken = await this.generateAccesstoken(user.id, user.role.name);
            await this.reddisService.setValue("user", (0, class_transformer_1.plainToClass)(user_entity_1.User, user));
            await this.rabbitmqService.sendMessage("user_loggedIn", (0, class_transformer_1.plainToClass)(user_entity_1.User, user));
            return {
                message: success_messges_1.SUCCESS_MESSAGES.USER_LOGGEDIN,
                user: (0, class_transformer_1.plainToClass)(user_entity_1.User, user),
                accessToken,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async generateAccesstoken(userId, role) {
        try {
            const accessToken = this.jwtService.sign({ id: userId, role: role });
            await this.cacheService.setValue(common_enum_1.Common.ACCESS_TOKEN, accessToken);
            return accessToken;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async generateRefereshtoken(userId) {
        try {
            const refreshToken = this.jwtService.sign({ id: userId }, { expiresIn: "7d" });
            await this.cacheService.setValue(common_enum_1.Common.REFRESH_TOKEN, JSON.stringify(refreshToken));
            return refreshToken;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async validateRefreshToken(refreshToken) {
        try {
            const tokenRecord = await this.userService.findToken(refreshToken);
            if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
                throw new common_1.UnauthorizedException(error_messages_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN_OR_EXPIRES);
            }
            return tokenRecord;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw new common_1.UnauthorizedException(error.message);
            }
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async refreshToken(refresTokenDto) {
        try {
            const { refreshToken } = refresTokenDto;
            const tokenRecord = await this.validateRefreshToken(refreshToken);
            const user = tokenRecord.user;
            const accessToken = await this.generateAccesstoken(user.id, user.role.name);
            await this.cacheService.setValue(common_enum_1.Common.ACCESS_TOKEN, JSON.stringify(user));
            return { accessToken };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        client_service_1.ClientService,
        rabbitmq_service_1.RabbitmqService,
        client_service_1.ClientService])
], AuthService);
//# sourceMappingURL=auth.service.js.map