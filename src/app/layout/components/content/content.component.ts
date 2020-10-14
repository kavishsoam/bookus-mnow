import { Component, ViewEncapsulation } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';
@Component({
    selector: 'content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentComponent {
    /**
     * Constructor
     */
    constructor() { }

}
