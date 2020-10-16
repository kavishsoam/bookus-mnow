import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-client-intake-list',
    templateUrl: './import-clients.component.html',
    styleUrls: ['./import-clients.component.scss']
})
export class ImportClientsComponent implements OnInit {
    service: any = [];
    intakeList: any;
    intakeId: any;
    clientList: any;
    info: any;
    loader: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: any,
        public dialogRef: MatDialogRef<ImportClientsComponent>
    ) { }
    ngOnInit() {
    }

}
