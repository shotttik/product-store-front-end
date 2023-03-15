import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { Coupon, Discount, Expiration } from 'src/app/interfaces/coupons';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css'],
})
export class CouponsComponent implements OnInit {
  saleCode: string = '';
  expirations: Expiration[] = [];
  selectedExp: Expiration | undefined;
  selectedDisc: Discount | undefined;
  coupons: Coupon[] = [];
  discounts: Discount[] = [];

  constructor(
    private storeService: StoreService,
    private localStore: LocalService,
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private apiService: ApiService
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
    ];
  }
  ngOnInit(): void {
    this.getCoupons();
  }

  onGenerate() {
    this.saleCode =
      this.selectedDisc?.code +
      this.storeService.getRandomString(6) +
      this.selectedExp?.code;
    this.messageService.add({
      severity: 'success',
      summary: 'შეტყობინება',
      detail: 'კოდი დაგენერირდა!',
    });
  }
  onSave() {
    let coupon: Coupon = {
      ID: 0,
      code: this.saleCode,
      createDate: new Date(),
      endDate: this.storeService.getExpirationDate(this.selectedExp!.days),
      discount: this.selectedDisc?.percentage!,
      isUsed: false,
    };
    if (this.saleCode == '') return;
    let couponExists =
      this.coupons.filter((c) => c.code == this.saleCode).length > 0
        ? true
        : false;
    if (couponExists) {
      this.messageService.add({
        severity: 'error',
        summary: 'ყურადღება!',
        detail: 'ასეთი კუპონი უკვე არსებობს!!',
      });
      return false;
    }
    this.coupons.push(coupon);
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    this.http
      .post(`https:/localhost:7154/api/CreateCoupon`, coupon, {
        headers: headers,
      })
      .subscribe({
        next: (response: any) =>
          this.messageService.add({
            severity: 'success',
            summary: 'შეტყობინება!',
            detail: response.Message,
          }),
        error: (response) =>
          this.messageService.add({
            severity: 'errror',
            summary: 'ყურადღება!',
            detail: response.Message,
          }),
      });
    setTimeout(() => {
      this.getCoupons();
    }, 200);
    return true;
  }

  getCoupons() {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    this.http
      .get(`https:/localhost:7154/api/GetCoupons`, { headers: headers })
      .subscribe({
        next: (response: any) => {
          this.coupons = response;
          console.log(this.coupons);
        },
        error: (response) => console.log(response),
      });
  }
  customSort(event: SortEvent) {
    event.data!.sort((data1, data2) => {
      let result = null;
      if (
        !data1.isUsed &&
        this.isExpired(data1.endDate) < this.isExpired(data2.endDate)
      ) {
        result = -1;
        return event.order! * result;
      } else if (data1.isUsed < data2.isUsed) {
        result = -1;
        return event.order! * result;
      } else {
        result = 1;
        return event.order! * result;
      }
    });
  }

  onDeleteCoupon(id: number, code: string) {
    this.coupons = this.coupons.filter((coupon: Coupon) => {
      return coupon.code != code;
    });
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    this.http
      .post(`https:/localhost:7154/api/DelCoupon/${id}`, { headers: headers })
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'შეტყობინება!',
            detail: response.Message,
          });
        },
        error: (response) => {
          this.messageService.add({
            severity: 'error',
            summary: 'ყურადღება!',
            detail: response.Message,
          });
        },
      });
  }
  dateConverter(date: any) {
    return typeof date == typeof new Date()
      ? date.toDateString()
      : new Date(date).toDateString();
  }

  isExpired(date: any) {
    return new Date(date) < new Date();
  }
}
