import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HttpService } from './Http-observable.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private httpServer: HttpService, private router : Router) {}

    canActivate() {
        if(this.httpServer.loggdIn()) {
          return true;
        } else {
          alert('로그인 후 이용해 주세요.');
          return false;
        }
    }
}
