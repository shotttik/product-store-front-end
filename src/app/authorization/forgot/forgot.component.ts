import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { matchValidator } from 'src/app/form-validators';
import { EmailComponent } from '../inputs/email/email.component';
import { PasswordComponent } from '../inputs/password/password.component';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements AfterViewInit {
  @ViewChild(PasswordComponent) passwordComponent: any;
  @ViewChild(EmailComponent) emailComponent: any;


  forgotForm!: FormGroup;
  confirmForm!: FormGroup;
  userEmail: string = '';
  hide = true;
  response_message: any = '';
  error: string = '';


  constructor(private http: HttpClient, private router: Router) {
  }

  ngAfterViewInit(): void {
    this.forgotForm = new FormGroup({
      email: this.emailComponent.emailControl,
    });
    this.confirmForm = new FormGroup({
      email: this.emailComponent.emailControl,
      password: this.passwordComponent.passwordControl,
      confirmPassword: this.passwordComponent.confirmPasswordControl
    })

  }



  checkEmail() {
    if (this.forgotForm?.invalid || this.forgotForm == undefined) return
    console.log("checking")
    let data = JSON.stringify(this.forgotForm.value);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.
      post('https://localhost:7154/api/check', data, { headers: headers })
      .subscribe({
        next: (response: any) => {
          this.userEmail = this.forgotForm.value.email,
            this.confirmForm.controls['email'].setValue(this.forgotForm.value.email)
        },
        error: (response) => {
          this.response_message = '';
          this.error = response.error.Message;
          setTimeout(() => this.error = '', 5000)
        }
      })
  }


  changePassword() {
    if (this.confirmForm?.invalid || this.confirmForm == undefined) return
    let data = JSON.stringify(this.confirmForm.value);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.
      post('https://localhost:7154/api/forgot', data, { headers: headers })
      .subscribe({
        next: (response: any) => { this.router.navigate(['/store'], { state: { 'email': this.userEmail } }) },
        error: (response) => {
          this.response_message = '';
          this.error = response.error.Message;
          setTimeout(() => this.error = '', 5000)
        }
      })
  }
}
