import { ClientProxy } from "@nestjs/microservices";
export declare class RabbitmqService {
    private readonly client;
    constructor(client: ClientProxy);
    sendMessage(pattern: string, data: any): Promise<import("rxjs").Observable<any>>;
}
