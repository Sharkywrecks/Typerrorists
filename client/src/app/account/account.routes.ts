import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

export const ACCOUNT_ROUTES: Routes = [
  {path: 'login', component: LoginComponent},
  { path: 'verify-email', component: VerifyEmailComponent }
];
