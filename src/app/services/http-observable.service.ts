import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {
    constructor(private http : Http) {}
 //http.get으로 보낸 정보를 받는 함수를 여기 구현해놓고
    getUserByID (data : string) : Observable<string> {
        let body: string;
        let params: URLSearchParams = new URLSearchParams();
        params.set('param1', data);

        body = params.toString();
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post('/finduser', params.toString(), {headers: headers})
            .map(res => res.json());
    }

    getUserByName (data : string) : Observable<string> {
        let body: string;
        let params: URLSearchParams = new URLSearchParams();
        params.set('param1', data);

        body = params.toString();
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post('/findname', params.toString(), {headers: headers})
            .map(res => res.json());
    }

    getUserPhoto (data : string) : Observable<string> {
        let body: string;
        let params: URLSearchParams = new URLSearchParams();
        params.set('param1', data);

        body = params.toString();
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post('/findphoto', params.toString(), {headers: headers})
            .map(res => res.json());
    }

    getUserForm (id:string, pwd:string, name:string, comment:string ){
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);
        params.set('pwd', pwd);
        params.set('name', name);
        params.set('comment', comment);

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post('/form', params.toString(), {headers: headers})
            .map(res => res.json());
        }

    getUserLogin (id:string, pwd:string){
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);
        params.set('pwd', pwd);

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('auth'));

        return this.http.post('/login', params.toString(), {headers: headers})
                    .map(res => res)
        }

        loggdIn() {
            return (localStorage.getItem('auth') != null);
         }
        logout() {
            localStorage.removeItem('auth');
         }
}
