import { NgModule } from '@angular/core';
import { SearchComponentComponent } from './search-component/search-component.component';
import { MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from "@angular/common";
@NgModule({
    declarations: [
        SearchComponentComponent
    ],
    imports: [],
    providers: [],
    exports: [SearchComponentComponent]
})
export class SharedModule { }