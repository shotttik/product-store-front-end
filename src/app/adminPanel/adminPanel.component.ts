import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/interfaces/product';
import { StoreService } from 'src/app/services/store.service';
import { Coupon } from '../interfaces/coupons';
import { LocalService } from '../services/local.service';
import { Expiration, Discount } from '../interfaces/coupons'


@Component({
  selector: 'app-adminPanel',
  templateUrl: './adminPanel.component.html',
  styleUrls: ['./adminPanel.component.css']
})

export class AdminPanelComponent implements OnInit {

  products: any = [];
  displayedColumns: string[] = ['id', 'name', 'quantity', 'price'];
  UserId: number = 0;

  id: number = 0;
  name: string | undefined = undefined;
  quantity: number | undefined = undefined;
  price: number | undefined = undefined;
  product: Product | undefined;

  saleCode: string = '';
  expirations: Expiration[] = [];
  selectedExp: Expiration | undefined;
  selectedDisc: Discount | undefined;
  coupons: Coupon[] = [];
  discounts: Discount[] = [];

  newProductForm = new FormGroup({
    ID: this.id == 0 ? new FormControl(0) : new FormControl(this.id),
    Name: new FormControl('', [Validators.required]),
    Quantity: new FormControl('', [Validators.required,]),
    Price: new FormControl('', [Validators.required]),
  })



  constructor(
    private storeService: StoreService,
    private localStore: LocalService,
    private http: HttpClient,

  ) {
    this.expirations = [
      { name: '1 დღე', code: '1D', days: 1 },
      { name: '2 დღე', code: '2D', days: 2 },
      { name: '3 დღე', code: '3D', days: 3 },
      { name: '7 დღე', code: '7D', days: 7 },
      { name: '30 დღე', code: '30D', days: 30 },
    ];
    this.discounts = [
      { name: '10 პროცენტი', code: '10P', percentage: 10 },
      { name: '20 პროცენტი', code: '20P', percentage: 20 },
      { name: '30 პროცენტი', code: '30P', percentage: 30 },
      { name: '50 პროცენტი', code: '50P', percentage: 50 },
    ]

  }


  ngOnInit() {
    this.storeService.getStoreProducts().subscribe((data) => { this.products = data; });
    this.getCoupons()
  }
  onSubmit() {


    if (!this.newProductForm.valid) '';
    if (this.id) {
      this.newProductForm.value.ID = this.id;
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

    let data = JSON.stringify(this.newProductForm.value);
    this.http.
      post(`https://localhost:7154/api/AddProduct/`, data, { headers: headers }).subscribe({
        next: (response: any) =>
          response
        ,
        error: (response) =>
          console.log(response)

      });

    setTimeout(() => {
      this.storeService.getStoreProducts().subscribe((data) => { this.products = data; });

    }, 100)

  }

  onClear() {
    // this.newProductForm.reset();
    this.id = 0;
    this.name = '';
    this.price = undefined;
    this.quantity = undefined;
  }

  onDelete(id: number) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.
      post(`https:/localhost:7154/api/DelProduct/${id}`, { headers: headers }).subscribe({
        next: (response: any) =>
          response
        ,
        error: (response) =>
          console.log(response)
      });
    this.products = this.products.filter((product: Product) => product.ID !== id)
  }

  onEdit(id: number, name: string, quantity: number, price: number) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.price = price;

  }

  onGenerate() {
    this.saleCode = this.selectedDisc?.code + this.storeService.getRandomString(6) + this.selectedExp?.code;

  }
  onSave() {
    let coupon: Coupon = {
      ID: 0,
      code: this.saleCode,
      createDate: new Date(),
      endDate: this.storeService.getExpirationDate(this.selectedExp!.days),
      discount: this.selectedDisc?.percentage!
    };
    if (this.saleCode == '') return;
    let couponExists = this.coupons.filter(c => c.code == this.saleCode).length > 0 ? true : false;
    if (couponExists) { return alert("Coupon already exists") };
    this.coupons.push(coupon)
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.
      post(`https:/localhost:7154/api/CreateCoupon`, coupon, { headers: headers }).subscribe({
        next: (response: any) =>
          console.log(response)
        ,
        error: (response) =>
          console.log(response)
      });
  }

  onDeleteCoupon(id: number, code: string) {
    this.coupons = this.coupons.filter((coupon: Coupon) => { console.log(code, coupon.code); return coupon.code != code });
    console.log(this.coupons);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.
      post(`https:/localhost:7154/api/DelCoupon/${id}`, { headers: headers }).subscribe({
        next: (response: any) =>
          console.log(response)
        ,
        error: (response) =>
          console.log(response)
      });

  }

  getCoupons() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.http.
      get(`https:/localhost:7154/api/GetCoupons`, { headers: headers }).subscribe({
        next: (response: any) =>
          this.coupons = response
        ,
        error: (response) =>
          console.log(response)
      });
  };

  dateConverter(date: any) {
    return typeof (date) == typeof (new Date()) ? date.toDateString() : new Date(date).toDateString();
  }

}
