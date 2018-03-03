import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Observable } from 'rxjs/Observable';

declare var require: any;

@Component({
    selector : 'app',
    template :require('./app.component.html'),
    styles : [require('./app.component.css')]
})
export class AppComponent {
    constructor(private userService: UserService){}

    ngOnInit() {
        // get users from secure api end point
        return this.userService.getUsers('/users', '')
                .subscribe( data => {
                  if(data.json() != undefined){
                    this.userService.loginInfo(JSON.parse(data._body).no, JSON.parse(data._body).id, JSON.parse(data._body).name,
                                        JSON.parse(data._body).comment);
               }
          });
      }
}
