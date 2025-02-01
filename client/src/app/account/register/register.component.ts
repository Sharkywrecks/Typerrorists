import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/components/shared.module';
import { AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { map, of, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ SharedModule, TextInputComponent ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errors: string[] = [];
  

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')],
             [this.validateEmailNotTaken()]],
      password: [null, [Validators.required]],
      rememberMe: new FormControl(false)
    });
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next:() => this.router.navigateByUrl('/shop'),
      error:error => {
        console.log(error),
        this.errors = error.errors;
      }
    })
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return control => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) {
            return of(null);
          }
          return this.accountService.checkEmailExists(control.value).pipe(
            map(res => {
              return res ? { emailExists: true } : null;
            })
          );
        })
      );
    };
  }

  get displayNameControl(): FormControl {
    return this.registerForm.get('displayName') as FormControl;
  }

  get emailControl(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  
  get passwordControl(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get rememberMeControl(): FormControl {
    return this.registerForm.get('rememberMe') as FormControl;
  }
}
