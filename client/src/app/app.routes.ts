import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './account/login/login.component';
import { VerifyEmailComponent } from './account/verify-email/verify-email.component';
import { RegisterComponent } from './account/register/register.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent, 
        data: {breadcrumb: 'Home'}
    },
    /*{
        path: 'account', 
        loadChildren: () => import('./account/account.routes').then(mod => mod.ACCOUNT_ROUTES), 
        data: {breadcrumb: {skip: true}}
    },*/
    {path: 'login', component: LoginComponent},
    { path: 'verify-email', component: VerifyEmailComponent },
    { path: 'register', component: RegisterComponent },
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
