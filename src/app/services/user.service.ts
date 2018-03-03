import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { HttpService } from './Http-observable.service';
import { User } from '../models/user';

@Injectable()
export class UserService {
    userInfo : EventEmitter<User> = new EventEmitter();

    constructor(public http: Http){}

    getUsers(url: string, info: string) :Observable<any>{
        // add authorization header with jwt token
        let headers = new Headers();
        let postBody : string;
        let params: URLSearchParams = new URLSearchParams();
        if(info != ''){
          params.set('info', info);
        } else {
          console.log('info : ' + info);
        }
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('auth'));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, params.toString(), options)
            .map(res => res);
        }

        loginInfo (no: number,id: string, name: string, comment: string) {
          myInfo.no = no;
          myInfo.id = id;
          myInfo.name = name;
          myInfo.comment = comment;
        }

        putMyInfo() {
          return myInfo;
        }

        putMyNo() {
          return myInfo.no;
        }
}

var myInfo = {
  "no" : 0,
  "id" : '',
  "name" : '',
  "comment" : ''
}
