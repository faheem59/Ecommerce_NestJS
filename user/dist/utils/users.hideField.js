"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omitFields = omitFields;
function omitFields(user) {
    const { ...userWithoutSensitiveInfo } = user;
    return userWithoutSensitiveInfo;
}
//# sourceMappingURL=users.hideField.js.map