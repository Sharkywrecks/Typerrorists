import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/components/shared.module';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { StormComponent } from "../storm/storm.component";
import { BrainStormSessionService } from './brain-storm-session.service';
import { StormSearchComponent } from '../storm-search/storm-search.component';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, AutoCompleteModule, StormSearchComponent, StormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('search', {static: false}) searchTerm!: ElementRef;

  storms: any[] | undefined;
  value: any;
  isBrowser: boolean;
  brainStormSessionSubscription!: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private brainStormSessionService: BrainStormSessionService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit() {
  }

  ngOnDestroy() {
    this.brainStormSessionSubscription?.unsubscribe();
  }

  search(event: AutoCompleteCompleteEvent) {
    this.brainStormSessionSubscription?.unsubscribe();
    /*this.brainStormSessionSubscription = this.brainStormSessionService.getBrainStormSessions().subscribe(sessions => {
      this.storms = sessions ? [...sessions.map(session => session.sessionName)] : [];
    });*/
    this.brainStormSessionSubscription = this.brainStormSessionService.createStorm(event.query).subscribe(storms => {
      this.storms = storms;
    });
  }

  
  onSearch() {
    var query = this.searchTerm?.nativeElement.value;
    this.brainStormSessionSubscription = this.brainStormSessionService.createStorm(query).subscribe(storms => {
      this.storms = storms;
      console.log(storms);
    });
  }
}
