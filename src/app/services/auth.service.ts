import { Injectable } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';



@Injectable({
  providedIn: 'root',

})


export class AuthService {
  public jwtHelper: JwtHelperService = new JwtHelperService();


  constructor() {
  }


  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !this.jwtHelper.isTokenExpired(token);
  }


  tokenToUserData() {
    const token = localStorage.getItem('accessToken')
    const dToken = this.jwtHelper.decodeToken(token!);
    console.log(dToken)
    localStorage.setItem('balance', dToken.Balance);
  }


}
