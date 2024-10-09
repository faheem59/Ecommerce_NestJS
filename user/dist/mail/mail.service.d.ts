import { MailerService } from "@nestjs-modules/mailer";
import { ResetPasswordResponse, VerifyEmailResponse } from "../utils/success-response";
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    private loadTemplate;
    sendEmail(email: string): Promise<VerifyEmailResponse>;
    sendPasswordResetEmail(email: string, token: string): Promise<ResetPasswordResponse>;
}
