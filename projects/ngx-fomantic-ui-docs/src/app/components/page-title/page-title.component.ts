import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'demo-page-title',
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.css'],
    standalone: false
})
export class PageTitleComponent {
    @HostBinding('class.ui')
    @HostBinding('class.masthead')
    @HostBinding('class.vertical')
    @HostBinding('class.segment')
    public classes = true;
}
