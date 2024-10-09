import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
export declare class AuthGuard implements CanActivate {
    private cacheManager;
    private jwtService;
    private reflector;
    constructor(cacheManager: Cache, jwtService: JwtService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
