import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProfileComponent } from './profile/profile.component';
import { AuthService } from './services/auth.service';
import { LocalService } from './services/local.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService],
})
export class AppComponent implements AfterViewInit {
  title = 'auth';

  constructor(
    public localService: LocalService,
    public router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {}

  logOut() {
    this.localService.clearData();
    this.router.navigate(['/login']);
    this.messageService.add({
      severity: 'success',
      summary: 'ყურადღება!',
      detail: 'წარმატებით გახვედით ანგარიშიდან',
    });
  }

  goPRofileOrMarket(onProfile: boolean): void {
    if (onProfile) {
      this.router.navigate(['/store']);
    } else {
      this.router.navigate(['/profile']);
    }
  }
  isSuperUser() {
    return this.authService.IsSuperUser();
  }

  IsStoreComp() {
    return this.router.url == '/store';
  }

  goToUsers(onUsers: boolean) {
    if (onUsers) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/admin/users']);
    }
  }
  IsUsers() {
    return this.router.url == '/admin/users';
  }

  goToCoupons() {
    this.router.navigate(['/admin/coupons']);
  }
}
