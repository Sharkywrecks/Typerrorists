import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { IUser } from '../../shared/models/user';
import { SharedModule } from '../../shared/components/shared.module';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
onSearch() {
throw new Error('Method not implemented.');
}
  @ViewChild('search', {static: false}) searchTerm!: ElementRef;
  currentUser$!: Observable<IUser | null>;

  wishlistCount: number = 0;

  constructor(private accountService: AccountService) {
    this.currentUser$ = this.accountService.currentUser$;
  }
    
  ngOnInit() {}

  logout() {
    this.accountService.logout();
  }
}
