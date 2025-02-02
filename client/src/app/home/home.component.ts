import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/components/shared.module';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { StormComponent } from "../storm/storm.component";
import { BrainStormSessionService } from './brain-storm-session.service';
import { StormSearchComponent } from '../storm-search/storm-search.component';
import { Node, Edge, NgxGraphModule } from '@swimlane/ngx-graph';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastrService } from 'ngx-toastr';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, AutoCompleteModule, StormSearchComponent, StormComponent, NgxGraphModule, FileUploadModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('search', {static: false}) searchTerm!: ElementRef;
  update$: Subject<any> = new Subject();

  storms: any[] | undefined;
  value: any;
  previousNode: string = '';
  isBrowser: boolean;
  brainStormSessionSubscription!: Subscription;

  count = 0;
  query = '';

  links: Edge[] = [];

  nodes: Node[] = [];
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private brainStormSessionService: BrainStormSessionService,
    private changeDetectorRef: ChangeDetectorRef,
    private toastrService: ToastrService,) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.brainStormSessionSubscription?.unsubscribe();
  }
  
  onSearch() {
    this.brainStormSessionSubscription?.unsubscribe();
    if (this.searchTerm && this.searchTerm.nativeElement.value) {
      this.query = this.searchTerm?.nativeElement.value;
      this.searchTerm.nativeElement.value = '';
      this.previousNode = '0';
      this.nodes = [];
      this.links = [];
    }

    this.brainStormSessionSubscription = this.brainStormSessionService.createStorm(this.query).subscribe(storms => {
      this.nodes.push({
        id: this.previousNode,
        label: this.query,
      });
      storms.forEach((storm, index) => {
        this.count++;
        this.nodes.push({
          id: storm.id,
          label: storm.text,
        });
        this.links.push({
          id: 'A' + storm.id,
          source: this.previousNode,
          target: storm.id,
        });
      });
      this.storms = [...storms];
    });
    this.update$.next(true);
    this.changeDetectorRef.detectChanges();
  }

  onNodeClick($event: any) {
    this.previousNode = $event.id;
    this.query = $event.label;
    this.onSearch();
  }

  onBasicUploadAuto(event: any) {
    this.brainStormSessionService.createSchemaFile(event.files[0]).subscribe(() => {
      this.toastrService.success('File uploaded successfully');
    });
  }
}
