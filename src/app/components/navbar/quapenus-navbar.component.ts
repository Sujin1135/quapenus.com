import { Component } from '@angular/core';
import { HttpService } from '../../services/Http-observable.service';

declare var require: any;

@Component({
    selector : 'quapenus-navbar',
    template : require('./quapenus-navbar.component.html'),
    styles : [require('./quapenus-navbar.component.css')]
})
export class NavbarComponent {
      constructor(private httpService: HttpService){}
      logOut(){
        alert('로그아웃 되었습니다.');
        this.httpService.logout();
      }

      clickMenu() {
        return document.getElementById('navbar-toggle').click();
      }
}
