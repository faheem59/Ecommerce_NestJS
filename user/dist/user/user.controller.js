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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const public_decorator_1 = require("../auth/decorator/public.decorator");
const current_user_decorator_1 = require("../auth/decorator/current-user.decorator");
const error_messages_1 = require("../utils/error-messages");
const role_enum_1 = require("../enum/role-enum");
const permission_enum_1 = require("../enum/permission-enum");
const permission_dto_1 = require("./dto/permission-dto");
const mail_service_1 = require("../mail/mail.service");
let UserController = class UserController {
    constructor(userService, mailService) {
        this.userService = userService;
        this.mailService = mailService;
    }
    async forgotPassword(email) {
        const token = await this.userService.generatePasswordResetToken(email);
        await this.mailService.sendPasswordResetEmail(email, token);
    }
    async resetPassword(body) {
        const { token, newPassword } = body;
        return await this.userService.resetPassword(token, newPassword);
    }
    async verifyEmail(email) {
        return await this.userService.verfiyMail(email);
    }
    async findAll() {
        return this.userService.findAll();
    }
    async findAllInstructor() {
        return this.userService.findInstructor();
    }
    async findById(id) {
        return this.userService.findById(id);
    }
    async update(id, updateUserDto, user) {
        if (user.id !== id) {
            throw new common_1.HttpException(error_messages_1.ERROR_MESSAGES.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.userService.update(user.id, updateUserDto);
    }
    async updateStatus(userId, status, currentUser) {
        const adminId = currentUser.id;
        await this.userService.changeUserStatus(userId, status, adminId);
    }
    async addPermissions(userId, addPermissionsData) {
        return this.userService.addPermissionsToUser(userId, addPermissionsData.name);
    }
    async removePermissions(userId, removePermissionsData) {
        return this.userService.removePermissionsFromUser(userId, removePermissionsData.name);
    }
    async getPermissions(userId) {
        return this.userService.getUserPermissions(userId);
    }
    async remove(id, user) {
        if (user.id !== id) {
            throw new common_1.HttpException(error_messages_1.ERROR_MESSAGES.UNAUTHORIZED, common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.userService.remove(user.id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("forgot-password"),
    __param(0, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("reset-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)("verify"),
    __param(0, (0, common_1.Query)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyEmail", null);
__decorate([
    (0, public_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Get)("instructor"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllInstructor", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateStatus", null);
__decorate([
    (0, public_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Patch)(":id/permissions/add"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, permission_dto_1.AddPermissionsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addPermissions", null);
__decorate([
    (0, public_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Patch)(":id/permissions/remove"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, permission_dto_1.RemovePermissionsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removePermissions", null);
__decorate([
    (0, public_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.Get)(":id/permissions"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)({
        version: "1",
        path: "users",
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        mail_service_1.MailService])
], UserController);
//# sourceMappingURL=user.controller.js.map