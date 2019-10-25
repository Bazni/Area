import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {RegisterComponent} from "./register/register.component";
import {ProfileComponent} from './profile/profile.component';
import {LoginComponent} from "./login/login.component";
import {AboutComponent} from './about/about.component';
import {NavComponent} from "./nav/nav.component";
import {IndexComponent} from './index/index.component';

import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatAutocompleteModule,MatDialogModule, MatSliderModule,MatSlideToggleModule,MatCheckboxModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSidenavModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JwtInterceptor} from '../services/httpconfig.interceptor';
import { UserUpdateDialogComponent } from './user-update-dialog/user-update-dialog.component';
import {AreaDialog} from "./dashboard/dashboard.component";
import {MatStepperModule} from '@angular/material/stepper';
import { AreaUpdateDialogComponent } from './area-update-dialog/area-update-dialog.component';
import {UpgradeComponent} from "./upgrade/upgrade.component";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatStepperModule,
    MatAutocompleteModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    NavComponent,
    RegisterComponent,
    AboutComponent,
    LoginComponent,
    ProfileComponent,
    IndexComponent,
    UserUpdateDialogComponent,
    AreaDialog,
    AreaUpdateDialogComponent,
    UpgradeComponent
  ],
  entryComponents : [AreaDialog, UserUpdateDialogComponent, AreaUpdateDialogComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi : true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
