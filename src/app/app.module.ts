import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { LoginComponent } from './authorization/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SignupComponent } from './authorization/signup/signup.component';
import { ForgotComponent } from './authorization/forgot/forgot.component';
import { EmailComponent } from './authorization/inputs/email/email.component';
import { PasswordComponent } from './authorization/inputs/password/password.component';
import { StoreComponent } from './store/store.component';
import { PaginationComponent } from './store/pagination/pagination.component';
import { AdminPanelComponent } from './adminPanel/adminPanel.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InterceptorService } from './services/interceptor.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './adminPanel/users/users.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { CouponsComponent } from './adminPanel/coupons/coupons.component';
import { AdminNavComponent } from './adminPanel/admin-nav/admin-nav.component';
import { StoreNavComponent } from './store/store-nav/store-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StoreComponent,
    SignupComponent,
    ForgotComponent,
    EmailComponent,
    PasswordComponent,
    StoreComponent,
    PaginationComponent,
    AdminPanelComponent,
    ProfileComponent,
    UsersComponent,
    CouponsComponent,
    AdminNavComponent,
    StoreNavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TableModule,
    ButtonModule,
    TreeModule,
    CardModule,
    DropdownModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    InputTextModule,
    CheckboxModule,
    FileUploadModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
  ],
  exports: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
