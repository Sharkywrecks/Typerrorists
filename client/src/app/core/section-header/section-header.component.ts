import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { BreadcrumbComponent, BreadcrumbService } from 'xng-breadcrumb';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, RouterModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.scss'
})
export class SectionHeaderComponent implements OnInit {
  breadcrumb$: Observable<any[]> | undefined;

  constructor(private bcService: BreadcrumbService, private location: Location) { }

  ngOnInit() {
    this.breadcrumb$ = this.bcService.breadcrumbs$;
  }

  goBack() {
    this.location.back();
  }
}
