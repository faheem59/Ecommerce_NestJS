import { Permission } from "../entities/permission.entity";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { ClientService } from "../../redisClient/client.service";
export declare class PermissionRepository {
    private cacheService;
    private readonly userRepository;
    private readonly permissionRepository;
    constructor(cacheService: ClientService, userRepository: Repository<User>, permissionRepository: Repository<Permission>);
    addPermissionsToUser(userId: number, permissionNames: string[]): Promise<User>;
    removePermissionsFromUser(userId: number, permissionNames: string[]): Promise<User>;
    getUserPermissions(userId: number): Promise<Permission[]>;
}
