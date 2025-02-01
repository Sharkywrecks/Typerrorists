import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AccountService } from './account/account.service';
import { CoreModule } from './core/core.module';
import { Client } from './client.api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CoreModule,
    NgxSpinnerModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  title = 'typerrorists';

  constructor(
    private accountService: AccountService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
        this.loadCurrentUser();
    }
  }

  loadCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.accountService.loadCurrentUser(token).subscribe({
        error:error => {
          console.error(error);
          localStorage.removeItem('token');
        }
      });
    } else {
      localStorage.removeItem('token');
    }
  }
}
