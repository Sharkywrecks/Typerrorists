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
import { ButtonModule } from 'primeng/button';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, 
    AutoCompleteModule, 
    StormSearchComponent, 
    StormComponent, 
    NgxGraphModule, 
    FileUploadModule,
    ButtonModule
  ],
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
  files!: any;
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
      
      this.nodes.push({
        id: this.previousNode,
        label: this.query,
      });
    }
    this.brainStormSessionSubscription = this.brainStormSessionService.createStorm(this.query).subscribe(storms => {
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
      this.storms = storms;
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
    console.log(event); // Debugging: Check what event.files[0] actually contains
  
    if (event.files && event.files.length > 0) {
      const file = event.files[0]; // Extract first file
  
      if (file instanceof File) {
        this.brainStormSessionService.createSchemaFile(file).subscribe((files) => {
          this.files = files;
          this.toastrService.success('File uploaded successfully');
        });
      } else {
        console.error('Uploaded object is not a valid File:', file);
        this.toastrService.error('Invalid file format');
      }
    } else {
      console.error('No files received');
      this.toastrService.error('No file uploaded');
    }
  }
  
  exportFiles() {
    if (this.files && this.files.length > 0) {
      this.files.forEach((file: any) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.download = file.name;
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
    } else {
      this.toastrService.error('No files available for download');
    }
  }
}
