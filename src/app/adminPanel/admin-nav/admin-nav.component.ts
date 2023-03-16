import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css'],
})
export class AdminNavComponent implements OnInit {
  currentUrl: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {
    this.currentUrl = this.location.path();
  }
  ngOnInit(): void {}

  isSuperUser() {
    return this.authService.IsSuperUser();
  }
  goToPanel(): void {
    this.router.navigate(['/admin']);
    setTimeout(() => {
      this.currentUrl = this.location.path();
    }, 100);
  }
  goToCoupons(): void {
    this.router.navigate(['/admin/coupons']);
    setTimeout(() => {
      this.currentUrl = this.location.path();
    }, 100);
  }
  goToUsers(): void {
    this.router.navigate(['/admin/users']);
    setTimeout(() => {
      this.currentUrl = this.location.path();
    }, 100);
  }
}
