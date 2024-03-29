import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './adminPanel/adminPanel.component';
import { CouponsComponent } from './adminPanel/coupons/coupons.component';
import { UsersComponent } from './adminPanel/users/users.component';
import { ForgotComponent } from './authorization/forgot/forgot.component';
import { LoginComponent } from './authorization/login/login.component';
import { SignupComponent } from './authorization/signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';
import { StoreComponent } from './store/store.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'store', component: StoreComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot', component: ForgotComponent },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: '1' },
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'admin/users',
    component: UsersComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: '1', IsSuperUser: true },
  },
  {
    path: 'admin/coupons',
    component: CouponsComponent,
    canActivate: [RoleGuard],
    data: { expectedRole: '1' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
