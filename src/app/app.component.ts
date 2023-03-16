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
    private router: Router,
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
}
