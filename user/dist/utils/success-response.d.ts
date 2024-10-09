import { User } from "../user/entities/user.entity";
export declare class CreateUserResponse {
    message: string;
    user: User;
}
export declare class UpdateUserResponse {
    message: string;
    user?: User;
}
export declare class DeleteUserResponse {
    message: string;
}
export declare class FindAllUsersResponse {
    message: string;
    users: User[];
}
export declare class FindSingleUsersResponse {
    statusCode?: number;
    message: string;
    user?: User;
}
export declare class LoginUserResponse {
    message: string;
    user?: User;
    accessToken?: string;
}
export declare class VerifyEmailResponse {
    message: string;
}
export declare class ResetPasswordResponse {
    message: string;
}
