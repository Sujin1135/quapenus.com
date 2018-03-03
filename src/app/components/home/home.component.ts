import { Component } from '@angular/core';

declare var require: any;

@Component({
    selector: 'home',
    template: require('./home.component.html'),
    styles: [require('./home.component.css')]
})
export class HomeComponent {}
