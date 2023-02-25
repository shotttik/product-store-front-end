import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { matchValidator } from '../../form-validators';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PasswordComponent } from '../inputs/password/password.component';
import { EmailComponent } from '../inputs/email/email.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements AfterViewInit {
  @ViewChild(PasswordComponent) passwordComponent: any;
  @ViewChild(EmailComponent) emailComponent: any;

  hide = true;
  signupForm!: FormGroup;
  error: string = ''; // registraciis warumateblad dasrulebistvis

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngAfterViewInit(): void {
    this.signupForm = new FormGroup({
      email: this.emailComponent.emailControl,
      password: this.passwordComponent.passwordControl,
      confirmPassword: this.passwordComponent.confirmPasswordControl,
    });
  }

  onSubmit() {
    if (this.signupForm?.invalid || this.signupForm == undefined) return;

    let data = JSON.stringify(this.signupForm.value);
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    this.http
      .post('https://localhost:7154/api/signup', data, { headers: headers })
      .subscribe({
        next: (response: any) => {
          this.router.navigate(['/login'], { state: response });
        },
        error: (response) => {
          this.error = response.error.Message;
          setTimeout(() => (this.error = ''), 5000);
        },
      });
    this.messageService.add({
      severity: 'success',
      summary: 'შეტყობინება',
      detail: 'წარმატებით დარეგისტრირდით!',
    });
  }
}
