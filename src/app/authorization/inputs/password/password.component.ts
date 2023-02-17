import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { matchValidator } from 'src/app/form-validators';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  passwordControl = new FormControl('', [Validators.required, Validators.minLength(8), matchValidator('confirmPassword', true)],);
  confirmPasswordControl = new FormControl('', [Validators.required, Validators.minLength(8), matchValidator('password')]);

  constructor(public router: Router) {

  }

  ngOnInit() {
  }

  getErrorMessage() {

    if (this.passwordControl.hasError('required')) {
      return 'You must enter a value';
    }
    return this.passwordControl.hasError('minlength') ? 'Please enter at least 8 characters' : '';


  }

}
