export class Song {
       id: number;
       title: string
       name: string;
       main: string;
       grade: number;
       no: number;
       picture: string;
       song: string;

      constructor(public song_id: number, public song_title: string, public song_name: string,
              public song_main: string, public song_grade: number, public song_no: number, public song_picture: string, public song_song: string){
        this.id = song_id;
        this.title = song_title;
        this.name = song_name;
        this.main = song_main;
        this.grade = song_grade;
        this.no = song_no;
        this.picture = song_picture;
        this.song = song_song;
      }
}