import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpService } from './Http-observable.service';

@Injectable()
export class SongService {
  constructor(private http: Http){}

  getAllSongs() {
    let headers : Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('auth'));

    return this.http.get('/songs', {headers: headers})
        .map(res => {
          return res;
        });
  }

  getById(id: number) {
    let headers : Headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('auth'));

    return this.http.post(`/songs/${id}`, '', {headers: headers})
        .map(res => res);
  }

  createSong(title: string, comment: string, no) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('title', title);
    params.set('comment', comment);
    params.set('no', no);

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('auth'));

    return this.http.post('/songs', params.toString(), {headers: headers})
        .map(res => {
          return res;
        });
    }

    addPath(location: string, path: string, id) {
      let params: URLSearchParams = new URLSearchParams();
      params.set('location', location);
      params.set('id', id);

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', 'Bearer ' + localStorage.getItem('auth'));

      return this.http.post(`/songs/${path}`, params.toString(), {headers: headers})
        .map(res => {
          return res;
        });
    }

    updateSong(id: number, title: string, comment: string) {
      let params: URLSearchParams = new URLSearchParams();
      params.set('title', title);
      params.set('comment', comment);

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', 'Bearer ' + localStorage.getItem('auth'));

      return this.http.put(`/songs/${id}`, params.toString(), {headers: headers});
    }

    deleteSong(id: number): Observable<any> {
      let headers = new Headers();
      headers.append('Authorization', 'Bearer ' + localStorage.getItem('auth'));
      return this.http.delete(`/songs/${id}`, {headers: headers});
    }

    awsDelete(file: string, path: string) {
      let params: URLSearchParams = new URLSearchParams();
      console.log(file);

      params.set('file', file);
      params.set('path', path);

      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Authorization', 'Bearer ' + localStorage.getItem('auth'));

      return this.http.post('/songs/file', params.toString(), {headers: headers});
    }
}
