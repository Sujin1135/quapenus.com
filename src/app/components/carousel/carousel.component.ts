import { Component } from '@angular/core';

declare var require: any;

@Component({
    selector: 'carousel',
    template: require('./carousel.component.html'),
    styles: [require('./carousel.component.css')]
})
export class CarouselComponent {

}
