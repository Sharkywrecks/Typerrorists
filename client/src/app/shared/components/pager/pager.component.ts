import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../shared.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pager',
  standalone: true,
  imports: [ PaginationModule, FormsModule ],
  templateUrl: './pager.component.html',
  styleUrl: './pager.component.scss'
})
export class PagerComponent implements OnInit {
  @Input() totalCount!: number;
  @Input() pageSize!: number;
  @Input() pageNumber!: number;
  @Output() pageChanged = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }
  
  onPagerChange(event: any){
    this.pageChanged.emit(event.page);
  }

}
