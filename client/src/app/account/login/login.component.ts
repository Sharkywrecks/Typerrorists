import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { SharedModule } from '../../shared/components/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ SharedModule, TextInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnUrl!: string;
  
  constructor(private accountService: AccountService, 
              private router: Router,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home';
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false)
    });
  }

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe({
      next:() => this.router.navigateByUrl(this.returnUrl),
      error: (error) => console.log(error)
    });
  }
  
  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  
  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
  
  get rememberMeControl(): FormControl {
    return this.loginForm.get('rememberMe') as FormControl;
  }
}
