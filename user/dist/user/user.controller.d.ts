import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DeleteUserResponse, FindAllUsersResponse, UpdateUserResponse } from "../utils/success-response";
import { User } from "./interface/interface";
import { UserStatus } from "../enum/permission-enum";
import { AddPermissionsDto, RemovePermissionsDto } from "./dto/permission-dto";
import { MailService } from "../mail/mail.service";
export declare class UserController {
    private readonly userService;
    private readonly mailService;
    constructor(userService: UserService, mailService: MailService);
    forgotPassword(email: string): Promise<void>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<import("../utils/success-response").ResetPasswordResponse>;
    verifyEmail(email: string): Promise<import("../utils/success-response").VerifyEmailResponse>;
    findAll(): Promise<FindAllUsersResponse>;
    findAllInstructor(): Promise<FindAllUsersResponse>;
    findById(id: number): Promise<import("../utils/success-response").FindSingleUsersResponse>;
    update(id: number, updateUserDto: UpdateUserDto, user: User): Promise<UpdateUserResponse>;
    updateStatus(userId: number, status: UserStatus, currentUser: User): Promise<void>;
    addPermissions(userId: number, addPermissionsData: AddPermissionsDto): Promise<import("./entities/user.entity").User>;
    removePermissions(userId: number, removePermissionsData: RemovePermissionsDto): Promise<import("./entities/user.entity").User>;
    getPermissions(userId: number): Promise<any>;
    remove(id: number, user: User): Promise<DeleteUserResponse>;
}
