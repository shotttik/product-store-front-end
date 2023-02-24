import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProfileComponent } from './profile/profile.component';
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
    private messageService: MessageService
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
}
