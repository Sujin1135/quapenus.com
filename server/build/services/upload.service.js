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
var core_1 = require("@angular/core");
var formidable = require("formidable");
var aws = require("aws-sdk");
var UploadService = /** @class */ (function () {
    function UploadService() {
        this.s3 = new aws.S3();
        this.form = new formidable.IncomingForm({
            encoding: 'utf-8',
            keepExtensions: false
        });
        /* S3 버킷 설정 */
        this.params = {
            Bucket: 'quapenus',
            Key: null,
            ACL: 'public-read',
            Body: null
        };
        aws.config.region = 'ap-northeast-2';
        aws.config.accessKeyId = 'AKIAIFSXNDVG4Y6SKJFQ';
        aws.config.secretAccessKey = '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';
    }
    UploadService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], UploadService);
    return UploadService;
}());
exports.UploadService = UploadService;
