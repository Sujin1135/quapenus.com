import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

declare var require: any;

@Component({
  selector: 'song',
  template: require('./song.component.html'),
  styles: [require('./song.component.css')]
})
export class SongComponent {}
