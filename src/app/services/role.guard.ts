import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const expectedRole = route.data['expectedRole'];
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    const tokenPayload: any = decode(token!);
    const role =
      tokenPayload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
    if (!this.auth.isAuthenticated() || role !== expectedRole) {
      this.router.navigate(['/login']);
      localStorage.clear();
      return false;
    }
    return true;
  }
}
