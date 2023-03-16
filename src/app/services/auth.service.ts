import { Injectable } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public jwtHelper: JwtHelperService = new JwtHelperService();

  constructor() {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !this.jwtHelper.isTokenExpired(token);
  }
  decodeToken() {
    const token = localStorage.getItem('accessToken');
    const dToken = this.jwtHelper.decodeToken(token!);
    return dToken;
  }
  tokenToUserData() {
    const dToken = this.decodeToken();
    localStorage.setItem('balance', dToken.Balance);
  }

  getUserID() {
    const dToken = this.decodeToken();
    return dToken[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/primarysid'
    ]; //@TODO is it corretct?
  }

  IsSuperUser() {
    const dToken = this.decodeToken();
    return dToken.IsSuperUser === 'True';
  }
  IsAdmin() {
    const dToken = this.decodeToken();
    return dToken.Role == '1';
  }
}
