import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagerComponent } from './pager/pager.component';
import { PagingHeaderComponent } from './paging-header/paging-header.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { CdkStepperModule } from '@angular/cdk/stepper';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    PagerComponent,
    PagingHeaderComponent,
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    CdkStepperModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    PagerComponent,
    PagingHeaderComponent,
    CarouselModule,
    BsDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    CdkStepperModule,
  ]
})

export class SharedModule { }
