import { Component } from '@angular/core';
import { AuthGuard } from '../../services/auth.guard.service';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../../services/Http-observable.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

declare var require: any;

@Component({
    selector: 'login',
    template: require('./login.component.html')
})
export class LoginComponent {
    formModel: FormGroup;
    id: string;
    check: boolean;
    token: string;
    name: string;
    comment: string;
    picture: string;

    constructor(private httpServer: HttpService,
                private userService: UserService,
                private user : User) {
        this.formModel = new FormGroup({
            'id': new FormControl(),
            'pwd': new FormControl()
        });
    }

    onSubmit() {
        this.httpServer.getUserLogin(this.formModel.value.id, this.formModel.value.pwd)
            .subscribe((data) => {
                if(data.json().err) {
                    alert("아이디 혹은 비밀번호가 다릅니다.");
                } else {
                let token = data.json().token;
                // console.log('token: ' + token);
                localStorage.setItem('auth', token);
                alert('로그인 되었습니다.');
                this.userService.getUsers('/users', '')
                        .subscribe( data => {
                            this.user.id = JSON.parse(data._body).id;
                            this.user.name = JSON.parse(data._body).name;
                            this.user.comment = JSON.parse(data._body).comment;
                            if(JSON.parse(data._body).picture != null){
                                this.user.picture = JSON.parse(data._body).picture;
                            } else {
                                this.user.picture = "http://placehold.it/320x150";
                            }
                            console.log('this.user.id : '+this.user.id);
                            this.userService.userInfo.emit(this.user);
                    });
                }
            }, error => {
                alert('아이디 혹은 비밀번호가 다릅니다.');
            })
    }
}
