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
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const common_enum_1 = require("../enum/common-enum");
let ClientService = class ClientService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async setValue(key, value) {
        try {
            await this.cacheManager.set(key, value);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async getValue(key) {
        try {
            return await this.cacheManager.get(key);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async delKey(key) {
        try {
            return await this.cacheManager.del(key);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_enum_1.Common.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], ClientService);
//# sourceMappingURL=client.service.js.map