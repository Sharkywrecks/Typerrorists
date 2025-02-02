import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent, 
        data: {breadcrumb: 'Home'}
    },
    {
        path: 'account', 
        loadChildren: () => import('./account/account.routes').then(mod => mod.ACCOUNT_ROUTES), 
        data: {breadcrumb: {skip: true}}
    },
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
