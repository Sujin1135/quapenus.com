import { Component } from '@angular/core';

declare var require: any;

@Component({
    selector: 'quapenus-footer',
    template: require('./footer.component.html'),
    styles: [require('./footer.component.css')]
})
export class FooterComponent {}