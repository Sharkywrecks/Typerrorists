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
import { HttpClient } from '@angular/common/http';
import { StormDto } from '../client.api';

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
  files: any[] = [];
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private brainStormSessionService: BrainStormSessionService,
    private changeDetectorRef: ChangeDetectorRef,
    private toastrService: ToastrService, private http: HttpClient) {
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
      this.updateGraph(storms);
    });
  }

  onNodeClick($event: any) {
    this.previousNode = $event.id;
    this.query = $event.label;
    this.onSearch();
  }

  onBasicUploadAutoSchema(event: any) {  
    if (event.currentFiles && event.currentFiles.length > 0) {
      const file = event.currentFiles[0]; // Extract first file
      if (file instanceof File) {
        this.brainStormSessionService.createSchemaFile(file).subscribe((files) => {
          this.files = files;
          console.log('Files:', files);
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

  onBasicUploadAutoCsv(event: any) {
    if (event.currentFiles && event.currentFiles.length > 0) {
      const file = event.currentFiles[0]; // Extract first file
      if (file instanceof File) {
        this.brainStormSessionService.createSchemaCsv(file).subscribe((files) => {
          this.files = files;
          console.log('Files:', files);
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

  onBasicUploadAutoCsvToMiniMap(event: any) {
    if (event.currentFiles && event.currentFiles.length > 0) {
      const file = event.currentFiles[0];
      if (file instanceof File) {
        this.nodes = [];
        this.links = [];
        if (file && file.type === 'text/csv') {
          const reader = new FileReader();
      
          reader.onload = (e) => {
            const text = reader.result as string;
            this.processCSV(text);
          };
      
        reader.readAsText(file);
        } else {
          console.error('Uploaded object is not a valid File:', file);
          this.toastrService.error('Invalid file format');
        }
      }
    }
  }
  processCSV(csvText: string) {
    const lines = csvText.split('\n'); // Split by line
    const data = [];
  
    for (let i = 0; i < lines.length; i++) {
      const row = lines[i].trim();
  
      if (row) {
        const columns = row.split(','); // Split by comma
  
        if (columns.length >= 3) {
          const id = columns[0].trim();
          const sourceId = columns[1].trim();
          const text = columns[2].trim();
          
          this.nodes.push({
            id: id,
            label: text,
          });
          if (sourceId !== '-1') {
            this.links.push({
              id: 'A' + id,
              source: sourceId,
              target: id,
            });
          }
        }
      }
    }
    this.update$.next(true);
    this.changeDetectorRef.detectChanges();
  }

  exportFiles() {
    if (this.files && this.files.length > 0) {
      this.files.forEach((fileUrl: string) => {
        this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objectUrl;
          link.download = fileUrl.split('/').pop() || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(objectUrl);
        }, error => {
          this.toastrService.error(`Failed to download: ${fileUrl}`);
        });
      });
      this.files = [];
    } else {
      this.toastrService.error('No files available for download');
    }
  }

  private updateGraph(storms: StormDto[]) {
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
    this.update$.next(true);
    this.changeDetectorRef.detectChanges();
  }
}
