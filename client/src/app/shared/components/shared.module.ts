import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagerComponent } from './pager/pager.component';
import { PagingHeaderComponent } from './paging-header/paging-header.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OrderTotalsComponent } from './order-totals/order-totals.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterModule } from '@angular/router';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { BasketSummaryComponent } from './basket-summary/basket-summary.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    PagerComponent,
    PagingHeaderComponent,
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    OrderTotalsComponent,
    ReactiveFormsModule,
    FormsModule,
    CdkStepperModule,
    BasketSummaryComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    PagerComponent,
    PagingHeaderComponent,
    CarouselModule,
    BsDropdownModule,
    OrderTotalsComponent,
    ReactiveFormsModule,
    FormsModule,
    CdkStepperModule,
    BasketSummaryComponent
  ]
})

export class SharedModule { }
