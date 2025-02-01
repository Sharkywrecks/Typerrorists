import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/components/shared.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SectionHeaderComponent } from './section-header/section-header.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NavBarComponent,
    SectionHeaderComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NavBarComponent,
    SectionHeaderComponent
  ]
})
export class CoreModule { }
