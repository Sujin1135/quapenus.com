import { Component } from '@angular/core';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/song';

declare var require: any;

@Component({
  selector: 'song-product',
  template: require('./song-product.component.html'),
  providers: [SongService],
  styles: [require('./song-product.component.css')]
})
export class SongProductComponent {
  songs : Song[] = [];
  time : String = new Date().toISOString().
    replace(/T/, ' ').
    replace(/\..+/, '');

  constructor(private songService : SongService) {}

  ngOnInit() {
      this.songService.getAllSongs()
        .subscribe(data => {
            for(var i = 0; i < data.json().length; i++){
              let song : Song = new Song(data.json()[i].id,
                                        data.json()[i].name,
                                        data.json()[i].title,
                                        data.json()[i].main,
                                        data.json()[i].grade,
                                        data.json()[i].no,
                                        data.json()[i].picture,
                                        data.json()[i].song);
              if(song.picture == '') {
                song.picture = 'http://placehold.it/320x150';
                this.songs.push(song);
              } else {
                this.songs.push(song);
              }
            }
        });
    }
}
