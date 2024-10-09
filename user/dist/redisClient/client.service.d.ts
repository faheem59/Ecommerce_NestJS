import { Cache } from "cache-manager";
export declare class ClientService {
    private cacheManager;
    constructor(cacheManager: Cache);
    setValue(key: string, value: any): Promise<void>;
    getValue(key: string): Promise<any>;
    delKey(key: string): Promise<any>;
}
