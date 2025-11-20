import {Routes} from '@angular/router';
import {Login} from './components/login/login';
import {Register} from './components/register/register';
import {Contact} from './components/contact/contact';
import {Index} from './components/index';
import {Profile} from './components/profile/profile';
import {Details} from './components/details/details';
import {MyValorations} from './components/my-valorations/my-valorations';

export const routes: Routes = [
  {path: '', component: Index},
  {path: 'login', component: Login},
  {path: 'contact', component: Contact},
  {path: 'register', component: Register},
  {path: 'profile', component: Profile},
  {path: 'my-valorations', component: MyValorations},
  {path: 'details/:id', component: Details},
  {path: '**', redirectTo: 'login'}
];
