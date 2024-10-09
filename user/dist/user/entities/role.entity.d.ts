import { Role as RoleEnum } from "../../enum/role-enum";
import { User } from "./user.entity";
export declare class RoleEntity {
    id: number;
    name: RoleEnum;
    user: User[];
}
