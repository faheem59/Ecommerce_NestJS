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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./repositories/user-repository");
const user_entity_1 = require("./entities/user.entity");
const error_messages_1 = require("../utils/error-messages");
const success_messges_1 = require("../utils/success-messges");
const class_transformer_1 = require("class-transformer");
const permssion_repository_1 = require("./repositories/permssion-repository");
const crypto = require("crypto");
const client_service_1 = require("../redisClient/client.service");
const refreshToken_repository_1 = require("./repositories/refreshToken-repository");
let UserService = class UserService {
    constructor(userRepository, permissionRepository, reddisClient, refreshTokenRepository) {
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
        this.reddisClient = reddisClient;
        this.refreshTokenRepository = refreshTokenRepository;
        this.saltRounds = 10;
    }
    async create(userData) {
        try {
            const user = await this.userRepository.creatUser(userData);
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
            const admin = this.userRepository.createAdmin(adminData);
            return {
                message: success_messges_1.SUCCESS_MESSAGES.USER_CREATED,
                user: (0, class_transformer_1.plainToClass)(user_entity_1.User, admin),
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findOneEmail(email) {
        try {
            const user = await this.userRepository.findOneByEmail(email);
            if (!user) {
                throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return {
                message: success_messges_1.SUCCESS_MESSAGES.USER_LOGGEDIN,
                user: user,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findAll() {
        try {
            const users = await this.userRepository.findAll();
            const usersWithoutSensitiveInfo = users.map((user) => (0, class_transformer_1.plainToClass)(user_entity_1.User, user));
            await this.reddisClient.setValue("users", usersWithoutSensitiveInfo);
            return {
                message: success_messges_1.SUCCESS_MESSAGES.USER_RETRIEVED,
                users: usersWithoutSensitiveInfo,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findInstructor() {
        try {
            const users = await this.userRepository.findAllInstructor();
            const usersWithoutSensitiveInfo = users.map((user) => (0, class_transformer_1.plainToClass)(user_entity_1.User, user));
            await this.reddisClient.setValue("instructor", usersWithoutSensitiveInfo);
            return {
                message: success_messges_1.SUCCESS_MESSAGES.USER_RETRIEVED,
                users: usersWithoutSensitiveInfo,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async findById(id) {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND.replace("{id}", id.toString()));
            }
            return {
                message: success_messges_1.SUCCESS_MESSAGES.USER_RETRIEVED,
                user: (0, class_transformer_1.plainToClass)(user_entity_1.User, user),
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async update(id, updateUserData) {
        try {
            const updatedUser = await this.userRepository.updateOne(id, updateUserData);
            if (!updatedUser) {
                throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
            }
            return {
                message: success_messges_1.SUCCESS_MESSAGES.USER_UPDATED,
                user: (0, class_transformer_1.plainToClass)(user_entity_1.User, updatedUser),
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async changeUserStatus(userId, status, adminId) {
        await this.userRepository.updateUserStatus(userId, status, adminId);
    }
    async remove(id) {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND.replace("{id}", id.toString()));
            }
            await this.userRepository.destroy(id);
            return { message: success_messges_1.SUCCESS_MESSAGES.USER_REMOVED };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async generatePasswordResetToken(email) {
        const token = crypto.randomBytes(32).toString("hex");
        await this.userRepository.saveResetToken(email, token);
        return token;
    }
    async resetPassword(token, newPassword) {
        return await this.userRepository.resetPassword(token, newPassword);
    }
    async addPermissionsToUser(userId, permissionNames) {
        return this.permissionRepository.addPermissionsToUser(userId, permissionNames);
    }
    async removePermissionsFromUser(userId, permissionNames) {
        return this.permissionRepository.removePermissionsFromUser(userId, permissionNames);
    }
    async getUserPermissions(userId) {
        return this.permissionRepository.getUserPermissions(userId);
    }
    async verfiyMail(email) {
        return await this.userRepository.verfiyMail(email);
    }
    async saveUpdateToken(userId, token) {
        await this.refreshTokenRepository.saveUpdateToken(userId, token);
    }
    async findToken(token) {
        return await this.refreshTokenRepository.findToken(token);
    }
    async findTokenById(userId) {
        return await this.refreshTokenRepository.findTokenById(userId);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        permssion_repository_1.PermissionRepository,
        client_service_1.ClientService,
        refreshToken_repository_1.RefreshTokenRepository])
], UserService);
//# sourceMappingURL=user.service.js.map