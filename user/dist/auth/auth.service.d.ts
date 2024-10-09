import { CreateUserDto } from "./dto/sign-up-dto";
import { LoginDto } from "./dto/login-dto";
import { CreateUserResponse, LoginUserResponse } from "../utils/success-response";
import { JwtService } from "@nestjs/jwt";
import { RefreshToken } from "../user/entities/refreshToken.entity";
import { RefreshTokenDto } from "./dto/refresh-token-dto";
import { ClientService } from "../redisClient/client.service";
import { RabbitmqService } from "../rabbitmq/rabbitmq.service";
import { UserService } from "../user/user.service";
export declare class AuthService {
    private userService;
    private jwtService;
    private cacheService;
    private rabbitmqService;
    private reddisService;
    constructor(userService: UserService, jwtService: JwtService, cacheService: ClientService, rabbitmqService: RabbitmqService, reddisService: ClientService);
    createUser(userData: CreateUserDto): Promise<CreateUserResponse>;
    createAdmin(adminData: CreateUserDto): Promise<CreateUserResponse>;
    validateUser(userData: LoginDto): Promise<LoginUserResponse>;
    generateAccesstoken(userId: number, role: string): Promise<string>;
    generateRefereshtoken(userId: number): Promise<string>;
    validateRefreshToken(refreshToken: string): Promise<RefreshToken>;
    refreshToken(refresTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
}
