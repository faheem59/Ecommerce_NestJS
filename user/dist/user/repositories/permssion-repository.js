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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const common_1 = require("@nestjs/common");
const permission_entity_1 = require("../entities/permission.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const typeorm_3 = require("typeorm");
const error_messages_1 = require("../../utils/error-messages");
const common_enum_1 = require("../../enum/common-enum");
const client_service_1 = require("../../redisClient/client.service");
let PermissionRepository = class PermissionRepository {
    constructor(cacheService, userRepository, permissionRepository) {
        this.cacheService = cacheService;
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
    }
    async addPermissionsToUser(userId, permissionNames) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: [common_enum_1.Common.PERMISSION],
        });
        if (!user) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const permissions = await this.permissionRepository.find({
            where: { name: (0, typeorm_3.In)(permissionNames) },
        });
        if (permissions.length !== permissionNames.length) {
            throw new common_1.ConflictException(error_messages_1.ERROR_MESSAGES.INVALID_PERMISSION);
        }
        user.permissions = [...user.permissions, ...permissions];
        await this.userRepository.save(user);
        await this.cacheService.delKey(common_enum_1.Common.ACCESS_TOKEN);
        return user;
    }
    async removePermissionsFromUser(userId, permissionNames) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: [common_enum_1.Common.PERMISSION],
        });
        if (!user) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        user.permissions = user.permissions.filter((permission) => !permissionNames.includes(permission.name));
        await this.userRepository.save(user);
        return user;
    }
    async getUserPermissions(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: [common_enum_1.Common.PERMISSION],
        });
        if (!user) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        return user.permissions;
    }
};
exports.PermissionRepository = PermissionRepository;
exports.PermissionRepository = PermissionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [client_service_1.ClientService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PermissionRepository);
//# sourceMappingURL=permssion-repository.js.map