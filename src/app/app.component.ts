import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { LocalService } from './services/local.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'auth';


  constructor(public localService: LocalService, public router: Router) { };

  ngAfterViewInit(): void {

  };

  logOut() {
    this.localService.clearData();
    this.router.navigate(['/login']);

  }

  goPRofileOrMarket(onProfile: boolean):void{
    if (onProfile){
      this.router.navigate(["/store"]);
    }else{
      this.router.navigate(["/profile"]);
    }
  }


}
