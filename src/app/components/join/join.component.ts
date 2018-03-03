import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../services/http-observable.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { FileUploader } from 'ng2-file-upload';
import 'rxjs/add/operator/map';

declare var require: any;

@Component({
    selector : 'join',
    template : require('./join.component.html'),
    styles: [require('./join.component.css')],
    providers: [HttpService]
})
export class JoinComponent {
    public uploader:FileUploader = new FileUploader({url:'http://quapenus.com/photo'});
    formModel :  FormGroup;
    idChecker : number = 2;
    
    async1(){
        console.log('async1');
        let promise = new Promise((resolve, reject) => {
            let fileType : string;
            let form = this.formModel
            let formValue = this.formModel.value;
            let uploader_queue = this.uploader.queue;
                if(uploader_queue[uploader_queue.length-1]){
                    let splitFileName:Array<any> = uploader_queue[uploader_queue.length-1]._file.name.split('.');
                    fileType = splitFileName[splitFileName.length-1];
                }
                if(fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == null){
                    if(this.idChecker == 0 || this.idChecker == 2) {
                        alert('아이디 중복확인을 하십시오.');
                        reject();
                    } else if(formValue.id.length > 12) {
                        alert('아이디는 11자 이하로 설정해 주세요');
                        reject();
                    } else if(form.hasError('minlength',['pwdGroup', 'pwd'])) {
                        alert('비밀번호는 8자 이상 16자 이하로 설정하세요.');
                        reject();
                    } else if(this.pwdValidator(formValue.pwdGroup.pwd) == false){
                        alert('비밀번호는 영문 숫자 특수문자 조합으로 설정하세요!');
                        reject()
                    } else if(form.hasError('equal', ['pwdGroup'])) {
                        alert('비밀번호와 비밀번호 확인이 다릅니다.');
                        reject();
                    } else if(form.hasError('minlength', ['name'])) {
                        alert('이름을 2글자 이상 입력하세요.');
                        reject();
                    } else if(this.nameValidator(formValue.name) == false){
                        alert("이름은 8글자 이하로 특수문자는 '_'만 허용되며 첫문장엔 입력할 수 없습니다!");
                    } else if(formValue.id == null) {
                        alert('아이디를 입력하지 않았습니다.');
                        reject();
                    } else if(formValue.pwdGroup.pwd == '') {
                        alert('비밀번호를 입력하지 않았습니다.');
                        reject();
                    } else if(formValue.name == null) {
                        alert('이름을 입력하지 않았습니다.');
                        reject();
                    } else {
                        this.httpServer.getUserByName(formValue.name)
                            .subscribe(data => {
                                if(data == '0'){
                                    console.log(data);
                                    resolve();    
                                } else {
                                    console.log(data);
                                    alert("중복된 이름입니다.");
                                    reject();
                                }
                            });
                    }
                } else {
                    this.uploader.clearQueue();
                    alert('사진 파일 확장자는 jpg나 jpeg 혹은 png여야 합니다.');
                }
        });
        return promise;
    }

    async2() {
        console.log('async2');
        let promise = new Promise((resolve, reject) => {
            let fileType : string;
            let form = this.formModel
            let formValue = this.formModel.value;
            let uploader_queue = this.uploader.queue;
    
            if(this.idChecker = 1){
                this.httpServer.getUserForm(formValue.id, formValue.pwdGroup.pwd,
                     formValue.name, formValue.comment)
                .subscribe(data => {
                    resolve();
                }, error => {
                    reject();
                });
            }  
        });
    }

    async3() {
        let promise = new Promise((resolve, reject) => {
            let uploader_queue = this.uploader.queue;
            if(uploader_queue[uploader_queue.length-1]){
                uploader_queue[uploader_queue.length-1].upload();
                this.uploader.onCompleteItem = (item, response, status, header) => {
                    if(JSON.parse(response).success != null){
                        resolve();               
                    } else {
                        alert('사진 업로드에 실패하였습니다.');
                        reject();
                    }
                }
            } else {
                resolve();
            }
        });
    }

    constructor (private httpServer : HttpService, private userService : UserService) {
        this.formModel = new FormGroup({
            'id' : new FormControl('', [Validators.required, Validators.minLength(5)]),
            'pwdGroup' : new FormGroup({
            'pwd' : new FormControl('', Validators.minLength(8)),
            'pconfirm' : new FormControl('')
            }, equalValidator),
            'name' : new FormControl('', Validators.minLength(2)),
            'comment' : new FormControl()
        });

        function equalValidator({ value } : FormGroup) : { [key : string] : any } {
            const [first, ...rest] = Object.keys(value || {});
            const valid = rest.every(v => value[v] === value[first]);
            return valid ? null : { equal : true };
        }
    }


    idCheck(){
            let idChk = this.idValidator(this.formModel.value.id);
            if(idChk == true){
                this.httpServer.getUserByID(this.formModel.value.id)
                .subscribe(data => {
                    if(data == '0') {
                        if(this.formModel.value.id == '') {
                          this.idChecker = 0;
                          alert('아이디를 입력해 주세요.');
                        } else if(this.formModel.hasError('minlength', ['id'])){
                            this.idChecker = 0;
                            alert('아이디를 5글자 이상 입력해 주세요.');
                        } else {
                        alert('사용이 가능한 아이디입니다.');
                        this.idChecker = 1;
                        }
                    } else {
                        alert('중복된 아이디가 존재합니다.');
                        this.idChecker = 0;
                    }
                }, error => {
            });
            }
        }
   
    idValidator(id: string) {
        let idChk = /^[a-zA-Z0-9][a-zA-Z0-9_-]{3,9}$/;
        if(!id.match(idChk)){
            alert("영문 혹은 숫자 특수문자 '_'만 허용되며 첫문장에 특수문자를 입력할 수 없습니다!");
            return false;
        } else {
            return true;
        }
    }

    pwdValidator(pwd: string) {
        let pwdChk = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!~`@#&$%^*()\-_=+\\\|\[\]{};:\'"<>\/?]).{8,16}$/;
        if(!pwd.match(pwdChk)) {
            return false;
        } else {
            return true;
        }
    }

    nameValidator(name: string) {
        let idChk = /^[가-힣a-zA-Z0-9][가-힣a-zA-Z0-9_-]{1,7}$/;
        if(!name.match(idChk)) {
            return false;
        } else {
            return true;
        }
    }

    onSubmit(){
            this.async1()
                .then(() => this.async2())
                .then(() => this.async3())
                .then(result => {
                    alert('회원가입이 완료되었습니다.');
                    document.getElementById("cancel").click();
                });
        }

        cancel(){
            (<HTMLInputElement>document.getElementById("id")).value = '';
            (<HTMLInputElement>document.getElementById("pwd")).value = '';
            (<HTMLInputElement>document.getElementById("pwdConfirm")).value = '';
            (<HTMLInputElement>document.getElementById("name")).value = '';
            (<HTMLInputElement>document.getElementById("comment")).value = '';
            if(this.uploader.queue[this.uploader.queue.length-1]){
                this.uploader.clearQueue();
            }
        }
    }
