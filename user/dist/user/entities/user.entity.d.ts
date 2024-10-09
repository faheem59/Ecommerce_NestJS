import { RoleEntity } from "./role.entity";
import { UserStatus } from "../../enum/permission-enum";
import { Permission } from "./permission.entity";
import { RefreshToken } from "./refreshToken.entity";
export declare class User {
    id: number;
    name: string;
    email: string;
    phonenumber: string;
    password: string;
    role: RoleEntity;
    status: UserStatus;
    permissions: Permission[];
    refreshTokens: RefreshToken[];
    isVerified: boolean;
    resetToken: string;
    resetTokenExpiration: Date;
    deletedAt?: Date;
}
