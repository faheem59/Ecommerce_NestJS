import { Repository } from "typeorm";
import { RefreshToken } from "../entities/refreshToken.entity";
export declare class RefreshTokenRepository {
    private readonly refreshTokenReposoitry;
    constructor(refreshTokenReposoitry: Repository<RefreshToken>);
    saveUpdateToken(userId: number, token: string): Promise<void>;
    findToken(token: string): Promise<RefreshToken>;
    findTokenById(userId: number): Promise<RefreshToken | null>;
}
