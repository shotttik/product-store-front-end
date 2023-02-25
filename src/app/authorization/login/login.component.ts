import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { EmailComponent } from '../inputs/email/email.component';
import { PasswordComponent } from '../inputs/password/password.component';
import { LocalService } from 'src/app/services/local.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild(EmailComponent) emailComponent: any;
  @ViewChild(PasswordComponent) passwordComponent: any;

  hide = true;
  loginForm!: FormGroup;
  error: string = ''; // avtorizaciis warumateblad dasrulebistvis
  success: boolean = false; // avtorizaciis warmatebit dasrulebistvis
  response_message: any = '';
  email: FormControl | undefined;
  password: FormControl | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStore: LocalService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    const navigation = this.router.getCurrentNavigation()!;
    if (navigation.extras.state) {
      this.error = '';
      this.response_message = navigation.extras.state['Message'];
    }
  }

  ngAfterViewInit(): void {
    this.localStore.clearData();
    this.loginForm = new FormGroup({
      email: this.emailComponent.emailControl,
      password: this.passwordComponent.passwordControl,
    });
  }

  onSubmit() {
    if (this.loginForm?.invalid || this.loginForm == undefined) return;
    let data = JSON.stringify(this.loginForm.value);
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    this.http
      .post('https://localhost:7154/api/login', data, { headers: headers })
      .subscribe({
        next: (response: any) => {
          //TODO should be removed
          this.localStore.saveData('email', this.loginForm.value.email);
          this.localStore.saveData('id', response.UserID);
          this.localStore.saveData('level', response.Level);
          this.localStore.saveData('accessToken', response.Token);
          this.success = true;
          this.authService.tokenToUserData();

          const url = response.Level == 1 ? '/admin' : '/store';
          this.router.navigate([url], {
            state: { email: this.loginForm.value.email },
          });
        },
        error: (response) => {
          this.response_message = '';
          this.error = response.error.Message;
          setTimeout(() => (this.error = ''), 5000);
        },
      });
    this.messageService.add({
      severity: 'success',
      summary: 'შეტყობინება!',
      detail: 'წარმატებით გაიარეთ ავტორიზაცია',
    });
  }
}
