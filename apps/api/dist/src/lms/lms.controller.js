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
exports.LmsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../auth/jwt.guard");
const lms_service_1 = require("./lms.service");
let LmsController = class LmsController {
    constructor(lms) {
        this.lms = lms;
    }
    myCourses(req) {
        return this.lms.myCourses(req.user.id);
    }
    enroll(req, courseId) {
        return this.lms.enroll(req.user.id, courseId);
    }
    outline(req, courseId) {
        return this.lms.getOutline(req.user.id, courseId);
    }
    next(req, courseId) {
        return this.lms.getNextLesson(req.user.id, courseId);
    }
    lesson(req, lessonId) {
        return this.lms.getLesson(req.user.id, lessonId);
    }
    progress(req, lessonId, body) {
        return this.lms.updateProgress(req.user.id, lessonId, body);
    }
};
exports.LmsController = LmsController;
__decorate([
    (0, common_1.Get)('me/courses'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LmsController.prototype, "myCourses", null);
__decorate([
    (0, common_1.Post)('courses/:courseId/enroll'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LmsController.prototype, "enroll", null);
__decorate([
    (0, common_1.Get)('courses/:courseId/outline'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LmsController.prototype, "outline", null);
__decorate([
    (0, common_1.Get)('courses/:courseId/next'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LmsController.prototype, "next", null);
__decorate([
    (0, common_1.Get)('lessons/:lessonId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LmsController.prototype, "lesson", null);
__decorate([
    (0, common_1.Post)('lessons/:lessonId/progress'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('lessonId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], LmsController.prototype, "progress", null);
exports.LmsController = LmsController = __decorate([
    (0, common_1.Controller)('lms'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [lms_service_1.LmsService])
], LmsController);
//# sourceMappingURL=lms.controller.js.map