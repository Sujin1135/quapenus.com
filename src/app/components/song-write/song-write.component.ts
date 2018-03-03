import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader, Headers, FileUploaderOptions } from 'ng2-file-upload';
import { SongService } from '../../services/song.service';
import { UserService } from '../../services/user.service';

declare var require: any;

@Component({
  selector : 'song-write',
  template : require('./song-write.component.html'),
  providers: [SongService],
  styles: [require('./song-write.component.css')]
})
export class SongWriteComponent {
  formModel: FormGroup;
  no;

  public uploader : FileUploader = new FileUploader({url : 'http://quapenus.com/songs/cover',
      authToken: 'Bearer ' + localStorage.getItem('auth')
    });

  public songUploader : FileUploader = new FileUploader({url : 'http://quapenus.com/songs/mysong',
      authToken: 'Bearer ' + localStorage.getItem('auth')
    });
  constructor(private songService : SongService, private router : Router,
            private userService : UserService){
    this.formModel = new FormGroup({
      'title' : new FormControl('', Validators.minLength(2)),
      'comment' : new FormControl('', Validators.minLength(10))
     });
  }

  async1(param) {
    let promise = new Promise((resolve, reject) => {
      if(this.uploader.queue[this.uploader.queue.length-1]){
        this.uploader.queue[this.uploader.queue.length-1].upload();
        this.uploader.onCompleteItem = (item, response, status, header) => {
          if(JSON.parse(response).success != null){
            console.log('onCompleteItem');
            this.songService.addPath(JSON.parse(response).success, 'addPhoto', param)
              .subscribe(data => {
                console.log('data : ' + data);
                resolve(param);
              });                 
          } else {
            resolve(param);
          }
        }
      } else {
        resolve(param);
      }
    });
    return promise;
   }

   async2(param) {
     console.log('param : ' + param);
    let promise = new Promise((resolve, reject) => {
     if(this.songUploader.queue[this.songUploader.queue.length-1] != null){
       this.songUploader.queue[this.songUploader.queue.length-1].upload();
       this.songUploader.onCompleteItem = (item, response, status, header) => {
         if(JSON.parse(response).success != null){
           console.log('join success2');
           this.songService.addPath(JSON.parse(response).success, 'addSong', param)
             .subscribe(data => {
               console.log('data : '+data);
               resolve(true);
             });
         }
         resolve(true);
       }
     } else {
       resolve(true);
     }
    });
    return promise;
  }

  onSubmit(){
      let fileType : string;
      let songType : string;

      if(this.uploader.queue[this.uploader.queue.length-1]){
        let splitFileName:Array<any> = this.uploader.queue[this.uploader.queue.length-1]._file.name.split('.');
        fileType = splitFileName[splitFileName.length-1];
      }
      if(this.songUploader.queue[this.uploader.queue.length-1]){
        let splitFileName:Array<any> = this.songUploader.queue[this.songUploader.queue.length-1]._file.name.split('.');
        songType = splitFileName[splitFileName.length-1];
      }

        this.no = this.userService.putMyNo();
        if(this.formModel.hasError('minlength', ['title']) ||
            this.formModel.value.title == ''){
          alert('제목을 입력해 주세요.');
        } else if(this.formModel.hasError('minlength', ['comment']) ||
            this.formModel.value.comment == ''){
          alert('본문을 10글자 이상 입력해 주세요.');
        } else {
          console.log(this.formModel.hasError('minlength', ['title']));
          this.fileTypeCheck(fileType, songType);
      }
  }

  fileTypeCheck(fileType: string, songType: string) {
    let photoCheck : boolean = false;
    let audioCheck : boolean = false;

    if(fileType == 'jpg' || fileType =='jpeg' || fileType == 'png' || fileType == null){
      photoCheck = true;
    }

    if(songType == 'mp3' || songType == 'mp4' || songType == 'wav' 
      || songType == 'ogg' || songType == null){
      audioCheck = true;
    }
    console.log('songType : ' + songType);
    if(photoCheck == false) {
      alert('사진 파일 확장자는 jpg / jpeg / png 중 하나여야 합니다.');
      this.uploader.clearQueue();
    } else {
      if(audioCheck == false) {
        alert('음원 파일 확장자는 mp3 / mp4 / wav / ogg 중 하나여야 합니다.');
        this.songUploader.clearQueue();
      } else {
        this.songService.createSong(this.formModel.value.title, this.formModel.value.comment, this.no)
          .subscribe( data => {
            console.log(data.json().id);
            if(data.json().id != null) {
             console.log('join success');
             this.async1(data.json().id)
              .then((param) => this.async2(param))
              .then(result => {
                alert('글이 등록되었습니다.');
                this.router.navigate(['/song']);
              });       
          }
        });
      }
    }
  }    

  btnCancel(){
    return this.router.navigateByUrl('/song');
  }
}

// CRUD = https://medium.com/@feedbots/node-js-%EB%A1%9C-crud-%EB%A7%8C%EB%93%A4%EC%96%B4-%EB%B3%B4%EA%B8%B0-cdcbaf7174a7
