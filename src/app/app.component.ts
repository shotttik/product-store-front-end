import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from './services/local.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'auth';

  constructor(public localService: LocalService, private router: Router) { };

  ngOnInit(): void {
  };

  logOut() {
    this.localService.clearData();
    this.router.navigate(['/login']);

  }


}
