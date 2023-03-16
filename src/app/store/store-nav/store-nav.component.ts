import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-store-nav',
  templateUrl: './store-nav.component.html',
  styleUrls: ['./store-nav.component.css'],
})
export class StoreNavComponent {
  currentUrl: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {
    this.currentUrl = this.location.path();
  }
  ngOnInit(): void {}

  goToProfile(): void {
    this.router.navigate(['/profile']);
    setTimeout(() => {
      this.currentUrl = this.location.path();
    }, 100);
  }
  goToStore(): void {
    this.router.navigate(['/store']);
    setTimeout(() => {
      this.currentUrl = this.location.path();
    }, 100);
  }
}
