import { Injectable } from '@angular/core';
import *as formidable from 'formidable';
import *as aws from 'aws-sdk';

@Injectable()
export class UploadService {
    constructor(){
        aws.config.region = 'ap-northeast-2';
        aws.config.accessKeyId = 'AKIAIFSXNDVG4Y6SKJFQ';
        aws.config.secretAccessKey = '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';
    }

    s3 = new aws.S3();
    form = new formidable.IncomingForm({
        encoding: 'utf-8',
        keepExtensions: false
    });
    /* S3 버킷 설정 */
    params = {
        Bucket: 'quapenus',
        Key: null,
        ACL: 'public-read',
        Body: null
    }
}