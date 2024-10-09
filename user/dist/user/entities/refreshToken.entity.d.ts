import { User } from "./user.entity";
export declare class RefreshToken {
    id: number;
    token: string;
    expiresAt: Date;
    user: User;
}
