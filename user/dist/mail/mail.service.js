"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const fs = require("fs");
const path = require("path");
const success_messges_1 = require("../utils/success-messges");
const error_messages_1 = require("../utils/error-messages");
const common_enum_1 = require("../enum/common-enum");
let MailService = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async loadTemplate(templateName, replacements) {
        const templatePath = path.join(__dirname, "../mail/email-templates", `${templateName}.html`);
        let template = fs.readFileSync(templatePath, "utf-8");
        for (const key in replacements) {
            template = template.replace(new RegExp(`{{${key}}}`, "g"), replacements[key]);
        }
        return template;
    }
    async sendEmail(email) {
        const verificationLink = `http://localhost:3000/verify?email=${encodeURIComponent(email)}`;
        const htmlContent = await this.loadTemplate("verification-email", {
            verificationLink,
        });
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: common_enum_1.Common.VERIFICATION_SUBJECT,
                html: htmlContent,
            });
            return {
                message: success_messges_1.SUCCESS_MESSAGES.EMAIL_VERFIED,
            };
        }
        catch (error) {
            throw new Error(error_messages_1.ERROR_MESSAGES.FAILED_TO_SEND_EMAIL || error.message);
        }
    }
    async sendPasswordResetEmail(email, token) {
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        const htmlContent = await this.loadTemplate("password-reset-email", {
            resetLink,
        });
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: common_enum_1.Common.RESET_PASSWORD_SUBJECT,
                html: htmlContent,
            });
            return {
                message: success_messges_1.SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS,
            };
        }
        catch (error) {
            throw new Error(error_messages_1.ERROR_MESSAGES.FAILED_TO_SEND_RESET_MAIL || error.message);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map