import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SongService } from '../../services/song.service';
import { UserService } from '../../services/user.service';
import { Song } from '../../models/song';
import { FileUploader } from 'ng2-file-upload';
import { User } from '../../models/user';

declare var require: any;

@Component({
  selector: 'song-detail',
  template: require('./song-detail.component.html'),
  styles: [require('./song-detail.component.css')],
  providers: [SongService]
})
export class SongDetailComponent {
  btnCheck: Boolean = false;
  updateCheck: Boolean = false;
  formModel: FormGroup;
  song: Song;
  path = this.route.snapshot.params['id'];

  public uploader : FileUploader = new FileUploader({url : 'http://quapenus.com/songs/cover',
    authToken: 'Bearer ' + localStorage.getItem('auth'),
    additionalParameter: this.song
  });
  public songUploader : FileUploader = new FileUploader({url : 'http://quapenus.com/songs/mysong',
    authToken: 'Bearer ' + localStorage.getItem('auth'),
    additionalParameter: this.song
  });

  constructor(private songService : SongService, private userService : UserService,
                private route : ActivatedRoute, private router :Router, 
                private user:User){}

  async1(){
    let promise = new Promise((resolve, reject) => {
      this.songService.getById(this.path).subscribe(data => {
        this.song = new Song(data.json().id, data.json().name, data.json().title,
                data.json().main, data.json().grade, data.json().no, data.json().picture, data.json().song);
        if(this.song.picture == '') {
          this.song.picture = 'http://placehold.it/320x150';
        }
        if(!data) {
          reject(null)
        } else {
          resolve(data.json().no);
        }
      });   
    });
    return promise;
  }

  async2(params){
    let promise = new Promise((resolve, reject) => {
      this.userService.getUsers('users/', '')
        .subscribe(data => {
          this.user.no = data.json().no
          if(this.user.no == params) {
            this.btnCheck = true;
            resolve(null);
          } else {
            reject(null);
          }
        })
    });
    return promise;
  }
  
  uploadAsync1(param){
    let promise = new Promise((resolve, reject) => {
      if(this.uploader.queue[this.uploader.queue.length-1]){
        let picture = this.song.picture;
        this.uploader.queue[this.uploader.queue.length-1].upload();
        this.uploader.onCompleteItem = (item, response, status, header) => {
          if(this.song.picture != ''){
            this.songService.awsDelete(this.song.picture, 'song_picture/')
              .subscribe(data => {
                console.log(data);
                resolve(param);
              });
          } else {
            resolve(param);
          }
          if(JSON.parse(response).success != null){
            console.log('onCompleteItem');
            this.songService.addPath(JSON.parse(response).success, 'addPhoto', param)
              .subscribe(data => {
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

  uploadAsync2(param) {
    let promise = new Promise((resolve, reject) => {
      if(this.songUploader.queue[this.songUploader.queue.length-1]){
        this.songUploader.queue[this.songUploader.queue.length-1].upload();
        this.songUploader.onCompleteItem = (item, response, status, header) => {
          if(JSON.parse(response).success != null){
            console.log('onCompleteItem');
            console.log('this.song.song'+this.song.song);
            let song = this.song.song;
            if(song != null){
              this.songService.awsDelete(song, 'song_song/')
                .subscribe(data => {
                  console.log(data);
                  resolve();
                });
            } else {
              resolve();
            }
            this.songService.addPath(JSON.parse(response).success, 'addSong', param)
              .subscribe(data => {
              });                 
          } else {
            resolve();
          }
        }
      } else {
        resolve();
      }
    });
    return promise;
  }

  ngOnInit() {
    this.async1()
      .then((param) => this.async2(param))
      .then((result) => {
        console.log(result);
      });
      this.formModel = new FormGroup({
        'title' : new FormControl('', Validators.minLength(1)),
        'comment' : new FormControl('', Validators.minLength(10))
      });
  }

  deleteSong() {
    console.log(this.path);
    this.songService.deleteSong(this.path).subscribe( data => {
      if(data._body == '1') {
        alert('글이 성공적으로 삭제되었습니다.');
        this.router.navigateByUrl('/song');
      } else {
        alert('오류로 인하여 글이 삭제되지 않았습니다.');
        this.router.navigateByUrl('/song');
      }
    });
  }

  update() {
    this.updateCheck = !this.updateCheck;
    this.formModel.setValue({title : this.song.title,
                              comment : this.song.main});
  }

  onSubmit(){
    if(this.formModel.hasError('minlength', ['title']) ||
        this.formModel.value.title == ''){
        alert('제목을 입력해 주세요.');
    } else if(this.formModel.hasError('minlength', ['comment']) ||
        this.formModel.value.comment == '') {
        alert('본문을 10글자 이상 입력해 주세요.');
    } else {
      this.songService.updateSong(this.path, this.formModel.value.title,
              this.formModel.value.comment)
        .subscribe(data => {});
      this.uploadAsync1(this.path)
      .then((param) => this.uploadAsync2(param))
      .then((result) => {
        alert('글을 수정하였습니다.');
        this.router.navigate([`/song`]);
      });
    }
  }
}