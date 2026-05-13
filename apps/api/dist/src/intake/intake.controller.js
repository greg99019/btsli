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
exports.IntakeController = void 0;
const common_1 = require("@nestjs/common");
const intake_service_1 = require("./intake.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let IntakeController = class IntakeController {
    constructor(intake) {
        this.intake = intake;
    }
    submitLead(body) {
        return this.intake.submitLead(body);
    }
    submitAssessment(leadId, body) {
        return this.intake.submitAssessment(leadId, body);
    }
    listLeads() {
        return this.intake.listLeads();
    }
    getLead(id) {
        return this.intake.getLead(id);
    }
};
exports.IntakeController = IntakeController;
__decorate([
    (0, common_1.Post)('lead'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IntakeController.prototype, "submitLead", null);
__decorate([
    (0, common_1.Post)('assessment/:leadId'),
    __param(0, (0, common_1.Param)('leadId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IntakeController.prototype, "submitAssessment", null);
__decorate([
    (0, common_1.Get)('leads'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('COACH', 'SUPER_ADMIN'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntakeController.prototype, "listLeads", null);
__decorate([
    (0, common_1.Get)('lead/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('COACH', 'SUPER_ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IntakeController.prototype, "getLead", null);
exports.IntakeController = IntakeController = __decorate([
    (0, common_1.Controller)('intake'),
    __metadata("design:paramtypes", [intake_service_1.IntakeService])
], IntakeController);
//# sourceMappingURL=intake.controller.js.map