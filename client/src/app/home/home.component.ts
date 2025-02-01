import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SharedModule } from '../shared/components/shared.module';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { StormComponent } from "../storm/storm.component";

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, AutoCompleteModule, StormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  items: any[] | undefined;
  value: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit() {
  }

  search(event: AutoCompleteCompleteEvent) {
    let _items = [...Array(10).keys()];
    this.items = event.query ? [...Array(10).keys()].map((item) => event.query + '-' + item) : _items;
  }
}
