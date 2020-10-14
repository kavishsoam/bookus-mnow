import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
   MatDatepickerModule,
    MatDialogModule,
     MatFormFieldModule,
      MatIconModule,
       MatInputModule,
        MatSlideToggleModule,
         MatToolbarModule,
          MatTooltipModule,
           MatSelectModule,
            MatCheckboxModule,
             MatRadioModule,
              MatGridListModule,
               MatCardModule,
               MatPaginatorModule,
               MatSortModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
// import { MatCardModule } from '@angular/material/card';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material';
// import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule} from '@angular/material/menu';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// import { MyErrorStateMatcher } from './validation';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatGridListModule, MatCardModule,
    MatMomentDateModule,
    MatTableModule,
    MatTabsModule,
    MatMenuModule,
    MatStepperModule,
    MatListModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule
  ],
  exports : [
    MatButtonModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatToolbarModule, MatTooltipModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatGridListModule, MatCardModule,
    MatMomentDateModule,
    MatTableModule,
    MatTabsModule,
    MatMenuModule,
    MatStepperModule,
    MatListModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class MatSharedAngularModule { }




