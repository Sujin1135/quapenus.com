"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Song = /** @class */ (function () {
    function Song(song_id, song_title, song_name, song_main, song_grade, song_no, song_picture, song_song) {
        this.song_id = song_id;
        this.song_title = song_title;
        this.song_name = song_name;
        this.song_main = song_main;
        this.song_grade = song_grade;
        this.song_no = song_no;
        this.song_picture = song_picture;
        this.song_song = song_song;
        this.id = song_id;
        this.title = song_title;
        this.name = song_name;
        this.main = song_main;
        this.grade = song_grade;
        this.no = song_no;
        this.picture = song_picture;
        this.song = song_song;
    }
    return Song;
}());
exports.Song = Song;
