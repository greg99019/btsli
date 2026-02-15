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
exports.AssessmentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const assessments_service_1 = require("./assessments.service");
let AssessmentsController = class AssessmentsController {
    constructor(svc) {
        this.svc = svc;
    }
    get(req, assessmentId) {
        return this.svc.getAssessmentForStudent(req.user.id, assessmentId);
    }
    start(req, assessmentId) {
        return this.svc.startAttempt(req.user.id, assessmentId);
    }
    answer(req, attemptId, body) {
        return this.svc.saveAnswer(req.user.id, attemptId, body);
    }
    submit(req, attemptId) {
        return this.svc.submit(req.user.id, attemptId);
    }
};
exports.AssessmentsController = AssessmentsController;
__decorate([
    (0, common_1.Get)(':assessmentId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('assessmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(':assessmentId/start'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('assessmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "start", null);
__decorate([
    (0, common_1.Post)('attempts/:attemptId/answer'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('attemptId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "answer", null);
__decorate([
    (0, common_1.Post)('attempts/:attemptId/submit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('attemptId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "submit", null);
exports.AssessmentsController = AssessmentsController = __decorate([
    (0, common_1.Controller)('assessments'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [assessments_service_1.AssessmentsService])
], AssessmentsController);
//# sourceMappingURL=assessments.controller.js.map