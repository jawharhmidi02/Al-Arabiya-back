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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admins_service_1 = require("../services/admins.service");
const users_dto_1 = require("../dto/users.dto");
let AdminController = class AdminController {
    constructor(userService) {
        this.userService = userService;
    }
    signUp(user) {
        return this.userService.signup(user);
    }
    SignIn(email, password) {
        return this.userService.signin(email, password);
    }
    findAll(access_token) {
        return this.userService.findAll(access_token);
    }
    findById(id, access_token) {
        return this.userService.findById(id, access_token);
    }
    getAccount(access_token) {
        return this.userService.getAccount(access_token);
    }
    update(id, access_token, user) {
        return this.userService.update(id, user, access_token);
    }
    remove(id, access_token) {
        return this.userService.remove(id, access_token);
    }
    sendRecoverPass(email) {
        return this.userService.sendRecoverPassViaEmail(email.toLowerCase());
    }
    changePasswordFromRecover(access_token, password) {
        return this.userService.changePasswordFromRecover(access_token, password);
    }
    getRecoverPassHtml(access_token) {
        return this.userService.recoverPageHtml(access_token);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('/signup/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.UsersCreate]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('/signin/'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "SignIn", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/byid/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('/account'),
    __param(0, (0, common_1.Headers)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAccount", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('access_token')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, users_dto_1.UsersUpdate]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('/recoverpass/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "sendRecoverPass", null);
__decorate([
    (0, common_1.Post)('/changepassfromrecover/:password'),
    __param(0, (0, common_1.Query)('access_token')),
    __param(1, (0, common_1.Param)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changePasswordFromRecover", null);
__decorate([
    (0, common_1.Get)('/recoverhtml'),
    __param(0, (0, common_1.Query)('access_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRecoverPassHtml", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admins'),
    __metadata("design:paramtypes", [admins_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admins.controller.js.map