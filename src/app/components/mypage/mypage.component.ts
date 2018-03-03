import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { UserService } from '../../services/user.service';
import { FileUploader } from 'ng2-file-upload';
import { User } from '../../models/user';

declare var require: any;

@Component({
  selector: 'mypage',
  template: require('./mypage.component.html'),
  styles: [require('./mypage.component.css')]
})
export class MypageComponent {
    id: string;
    name: string;
    comment: string;
    picture: string;
    idChange: boolean = true;
    commentChange: boolean = true;
    pictureChange: boolean = false;
    nameForm : FormGroup;
    commentForm : FormGroup;
    queue: boolean = false;
    private uploadResult : any = null;

    public uploader : FileUploader = new FileUploader({url : 'http://quapenus.com/updatephoto',
      authToken: 'Bearer ' + localStorage.getItem('auth')
      }
    );

    constructor(private userService: UserService, private user: User){
      this.nameForm = new FormGroup({
        'name' : new FormControl('', Validators.minLength(2))
      });

      this.commentForm = new FormGroup({
        'comment' : new FormControl('')
      });

      this.getUsers();
    }

    pictureMouseOver() {
      return document.getElementById('picture-btn').style.display = "inline";
    }

    pictureMouseLeave() {
      return document.getElementById('picture-btn').style.display = "none";
    }

    infoChange(name: string, value: string){
      if(this.nameForm.hasError('minlength', ['name'])) {
          alert('이름을 두글자 이상 입력하세요.');
      } else {
        this.userService.getUsers(name, value)
                .subscribe(data => {
                  if(data._body == '0'){
                    alert("중복된 이름입니다.");
                  } else if(data._body == '1') {
                    alert("이름이 변경되었습니다.");
                    this.userService.getUsers('/users', '')
                      .subscribe( data => {
                          this.user.id = JSON.parse(data._body).id;
                          this.user.name = JSON.parse(data._body).name;
                          this.user.comment = JSON.parse(data._body).comment;

                          this.idChange = !this.idChange;
                        });
                    } else {
                      this.userService.getUsers('/users', '')
                        .subscribe( data => {
                            this.user.id = JSON.parse(data._body).id;
                            this.user.name = JSON.parse(data._body).name;
                            this.user.comment = JSON.parse(data._body).comment;

                            this.commentChange = !this.commentChange;
                        });
                    }
                });
              }
          }

          onChange() {
            let fileType : string;
            if(this.uploader.queue[this.uploader.queue.length-1]){
              let splitFileName:Array<any> = this.uploader.queue[this.uploader.queue.length-1]._file.name.split('.');
              fileType = splitFileName[splitFileName.length-1];
              if(this.uploader.queue[this.uploader.queue.length-2]){
                this.uploader.queue[this.uploader.queue.length-2].remove();
              }
            }
            if(fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png'){
              this.pictureChange = true;
              this.uploader.onCompleteItem = (item, response, status, header) => {
                if(JSON.parse(response).success){
                  this.getUsers();
                  alert('사진이 변경되었습니다.');
                  this.pictureChange = false;
                } else {
                  alert('사진 변경이 실패하였습니다.');
                }
              }
            } else {
              alert('jpg, jpeg, png 파일만 등록 가능합니다.');
              this.pictureChange = false;
            }
          }

          getUsers() {
            return this.userService.getUsers('/users', '')
                    .subscribe( data => {
                        this.user.id = JSON.parse(data._body).id;
                        this.user.name = JSON.parse(data._body).name;
                        this.user.comment = JSON.parse(data._body).comment;
                        if(JSON.parse(data._body).picture != null){
                          this.user.picture = JSON.parse(data._body).picture;
                        } else {
                          this.user.picture = "http://placehold.it/320x150";
                        }
              });
          }
      }