import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login-dto";
import { CreateUserDto } from "./dto/sign-up-dto";
import { CreateUserResponse, LoginUserResponse } from "../utils/success-response";
import { RefreshTokenDto } from "./dto/refresh-token-dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(signUpDto: CreateUserDto): Promise<CreateUserResponse>;
    signUpAdmin(signUpDto: CreateUserDto): Promise<CreateUserResponse>;
    login(loginDto: LoginDto): Promise<LoginUserResponse | string>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
}
