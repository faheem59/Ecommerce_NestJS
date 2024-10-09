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
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
const error_messages_1 = require("../../utils/error-messages");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const role_enum_1 = require("../../enum/role-enum");
const common_enum_1 = require("../../enum/common-enum");
const mail_service_1 = require("../../mail/mail.service");
const success_messges_1 = require("../../utils/success-messges");
let UserRepository = class UserRepository {
    constructor(repository, roleRepository, mailService) {
        this.repository = repository;
        this.roleRepository = roleRepository;
        this.mailService = mailService;
        this.saltRounds = 10;
    }
    async creatUser(userData) {
        const { password, role, ...rest } = userData;
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        const roleEntity = await this.roleRepository.findOne({
            where: { name: role },
        });
        if (!roleEntity) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.ROLE_NOT_FOUND);
        }
        const existingUser = await this.repository.findOne({
            where: { email: userData.email },
            withDeleted: true,
        });
        if (existingUser) {
            if (existingUser.deletedAt !== null) {
                existingUser.deletedAt = null;
                existingUser.password = hashedPassword;
                existingUser.role = roleEntity;
                existingUser.isVerified = false;
                await this.repository.save(existingUser);
                return existingUser;
            }
            throw new common_1.ConflictException(error_messages_1.ERROR_MESSAGES.USER_ALREADY_EXISTS);
        }
        const user = this.repository.create({
            ...rest,
            password: hashedPassword,
            role: roleEntity,
            isVerified: false,
        });
        await this.repository.save(user);
        try {
            await this.mailService.sendEmail(user.email);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return user;
    }
    async createAdmin(adminData) {
        const { password, ...rest } = adminData;
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        const existingAdmin = await this.repository.findOne({
            where: { email: adminData.email },
            withDeleted: true,
        });
        const roleEntity = await this.roleRepository.findOne({
            where: { name: role_enum_1.Role.ADMIN },
        });
        if (!roleEntity) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.ROLE_NOT_FOUND);
        }
        if (existingAdmin) {
            if (existingAdmin.deletedAt !== null) {
                existingAdmin.deletedAt = null;
                existingAdmin.password = hashedPassword;
                existingAdmin.isVerified = false;
                await this.repository.save(existingAdmin);
                return existingAdmin;
            }
            throw new common_1.ConflictException(error_messages_1.ERROR_MESSAGES.ADMIN_ALREADY_EXISTS);
        }
        const admin = this.repository.create({
            ...rest,
            password: hashedPassword,
            role: roleEntity,
            isVerified: false,
        });
        await this.repository.save(admin);
        try {
            await this.mailService.sendEmail(admin.email);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return admin;
    }
    async findOneByEmail(email) {
        return this.repository.findOne({
            where: { email },
            relations: [common_enum_1.Common.ROLE],
        });
    }
    async findOneByEmailDeleted(email) {
        return this.repository.findOne({
            where: { email },
            withDeleted: true,
        });
    }
    async findAll() {
        const allUsers = await this.repository.find({
            relations: [common_enum_1.Common.ROLE],
        });
        return allUsers.filter((user) => user.role?.name !== common_enum_1.Common.ADMIN);
    }
    async findAllInstructor() {
        const allUsers = await this.repository.find({
            relations: [common_enum_1.Common.ROLE],
        });
        const instructor = allUsers.filter((user) => user.role?.name === common_enum_1.Common.INSTRUCTOR);
        return instructor;
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async updateOne(id, updateUserData) {
        const { email } = updateUserData;
        const emailExist = await this.repository.findOne({
            where: { email, id: (0, typeorm_1.Not)(id) },
        });
        if (emailExist) {
            throw new common_1.ConflictException(error_messages_1.ERROR_MESSAGES.EMAIL_EXITS);
        }
        await this.repository.update(id, updateUserData);
        return this.repository.findOne({ where: { id } });
    }
    async destroy(id) {
        const user = await this.repository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUNDED);
        }
        await this.repository.softDelete({ id });
    }
    async saveResetToken(email, token) {
        const user = await this.repository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        user.resetToken = token;
        user.resetTokenExpiration = new Date(Date.now() + 3600000);
        await this.repository.save(user);
    }
    async findUserByToken(token) {
        const user = await this.repository.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: (0, typeorm_1.MoreThan)(new Date()),
            },
        });
        return user;
    }
    async resetPassword(token, newPassword) {
        const user = await this.findUserByToken(token);
        if (!user) {
            throw new common_1.BadRequestException(error_messages_1.ERROR_MESSAGES.INVALID_REFRESH_TOKEN_OR_EXPIRES);
        }
        user.password = await bcrypt.hash(newPassword, this.saltRounds);
        user.resetToken = null;
        await this.repository.save(user);
        return {
            message: success_messges_1.SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
        };
    }
    async isAdmin(userId) {
        const user = await this.repository.findOne({
            where: { id: userId },
            relations: [common_enum_1.Common.ROLE],
        });
        return user?.role?.name === role_enum_1.Role.ADMIN;
    }
    async updateUserStatus(userId, status, adminId) {
        if (!(await this.isAdmin(adminId))) {
            throw new Error(error_messages_1.ERROR_MESSAGES.USER_STATUS_NOT_CHANGED);
        }
        await this.repository.update(userId, { status });
    }
    async verfiyMail(email) {
        const user = await this.repository.findOne({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException(error_messages_1.ERROR_MESSAGES.USER_NOT_FOUND);
        }
        user.isVerified = true;
        await this.repository.save(user);
        return {
            message: success_messges_1.SUCCESS_MESSAGES.EMAIL_VERFIED,
        };
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_2.InjectRepository)(role_entity_1.RoleEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        mail_service_1.MailService])
], UserRepository);
//# sourceMappingURL=user-repository.js.map