import { Component, EventEmitter, OnDestroy, OnInit, Output, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { SearchComponentComponent } from 'app/shared/search-component/search-component.component';
// import { SearchComponentComponent } from 'app/main/search-component/search-component.component';
@Component({
    selector: 'fuse-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class FuseSearchBarComponent implements OnInit, OnDestroy {
    collapsed: boolean;
    fuseConfig: any;
    @Output()
    input: EventEmitter<any>;
    // Private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        public dialog: MatDialog
    ) {
        // Set the defaults
        this.input = new EventEmitter();
        this.collapsed = true;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (config) => {
                    this.fuseConfig = config;
                }
            );
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Collapse
     */
    collapse(): void {
        this.collapsed = true;
    }
    /**
     * Expand
     */
    expand(): void {
        this.collapsed = false;
        // this.openSearchBarComponent();
    }
    /**
     * Search
     *
     * @param event
     */
    search(event): void {
        this.input.emit(event.target.value);
    }

    // openSearchBarComponent(): void {
    //     const dialogRef = this.dialog.open(SearchComponentComponent, {
    //         width: '100vw',
    //         height: '100vh',
    //     });
    //     dialogRef.afterClosed().subscribe(result => {
    //     });
    // }
}
