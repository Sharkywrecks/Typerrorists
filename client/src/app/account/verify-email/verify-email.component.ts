import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit {
  baseUrl: string = environment.apiUrl;
  verificationSuccessesful: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private accountService: AccountService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      const token = params['token'];
    });
  }
}
