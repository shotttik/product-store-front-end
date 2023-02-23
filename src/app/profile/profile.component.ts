import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../interfaces/product';
import { AuthService } from '../services/auth.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userProducts: Product[] = [];
  private UserID: number;
  onPage = true;
  balance : number;
  paid : number = 0;
  constructor(
    private storeService: StoreService,
    private router: Router,
    private authservice: AuthService,
     ){
      this.UserID = authservice.getUserID()!;
      this.balance = parseFloat(localStorage.getItem('balance')!);
  };

  ngOnInit(): void {
    this.getUserProducts();
  };
  getUserProducts(): void {
    this.storeService.getUserProducts(this.UserID).subscribe((data) => {
      this.userProducts = data;
      this.userProducts.map(p =>  this.paid += p.Price * p.Quantity)

    });
  };

  
}
