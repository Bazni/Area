import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {AboutComponent} from "./about/about.component";
import {IndexComponent} from "./index/index.component";
import {ProfileComponent} from "./profile/profile.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {UpgradeComponent} from "./upgrade/upgrade.component";

const routes: Routes = [{path : '', component : IndexComponent},
  {path : 'register', component : RegisterComponent},
  {path : 'about', component : AboutComponent},
  {path : 'login', component : LoginComponent},
  {path: 'profile', component : ProfileComponent},
  {path : 'client.apk', component : UpgradeComponent},
  {path: 'dashboard', component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      }]}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
