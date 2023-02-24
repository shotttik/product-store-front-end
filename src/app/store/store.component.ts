import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from '../interfaces/product';
import { TransactionS } from '../interfaces/transaction';
import { LocalService } from '../services/local.service';
import { StoreService } from '../services/store.service';
import { PaginationComponent } from './pagination/pagination.component';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  providers: [MessageService],
})
export class StoreComponent implements AfterViewInit {
  @ViewChild(PaginationComponent) PaginationComp: any;

  email: string | null = '';
  UserID: number = 0;
  UserLevel: number = 0;
  Balance: number = 0;
  products: Product[] = [];
  userProducts: Product[] = [];
  product: Product | undefined;
  startIndex: number = 0;
  endIndex: number = 0;
  nodes: any[] = [];

  code: string = '';
  sum: number = 0;
  transactionS: TransactionS | undefined;
  coupon: string = '';
  discount: number = 0;
  discounted: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStore: LocalService,
    private storeService: StoreService
  ) {
    this.email = this.localStore.getData('email');
    this.UserID = parseInt(this.localStore.getData('id')!);
    this.UserLevel = parseInt(this.localStore.getData('level')!);
    this.Balance = parseFloat(this.localStore.getData('balance')!);
    this.nodes = [
      {
        key: '0',
        label: 'ანგარიში',
        children: [
          { key: '0-0', label: `მეილი: ${this.email}` },
          {
            key: '0-1',
            label: `სტატუსი: ${
              this.UserLevel == 0 ? 'მყიდველი' : 'ადმინსტრატორი'
            }`,
          },
          { key: '0-1', label: `ბალანსი: ${this.Balance}` },
        ],
      },
    ];
  }

  ngAfterViewInit(): void {
    this.getProducts();
    if (this.UserLevel == 0) {
      this.endIndex = this.PaginationComp.pageSize;
    }
  }

  getProducts(): void {
    this.storeService.getStoreProducts().subscribe((data) => {
      this.products = data;
    });
    setTimeout(() => {
      this.getCartProducts();
    }, 200);
  }

  getUserProducts(): void {
    this.storeService.getUserProducts(this.UserID).subscribe((data) => {
      this.userProducts = data;
    });
  }

  onChangePage(dict: any): void {
    this.startIndex = dict.startIndex;
    this.endIndex = dict.endIndex;
  }

  updateUserProducts(id: number, operation: string) {
    let userpr = this.userProducts.filter((product) => product.ID == id)[0];
    let storepr = this.products.filter((product) => product.ID == id)[0];
    if (operation === 'Add' && storepr.Quantity > 0) {
      userpr.Quantity += 1;
      this.sum += userpr.Price;
      storepr.Quantity -= 1;
    } else if (operation === 'Sub' && userpr.Quantity > 0) {
      userpr.Quantity -= 1;
      storepr.Quantity += 1;
      this.sum -= userpr.Price;
    } else {
      return false;
    }
    this.localStore.saveData('cart', JSON.stringify(this.userProducts));
    this.calculateSum();

    return true;
  }

  productToCart(p: Product) {
    let Add =
      p.ID == this.userProducts.filter((product) => product.ID == p.ID)[0]?.ID
        ? false
        : true;
    if (!Add) {
      return alert('Already Added, Sorry btw I dont like this alerts');
    }
    if (p.Quantity <= 0) {
      return alert('Quantity must be greater than zero');
    }

    p.Quantity -= 1;
    const new_product: Product = {
      ID: p.ID,
      Name: p.Name,
      Price: p.Price,
      Quantity: 1,
    };
    this.sum += new_product.Price;
    this.userProducts.push(new_product);
    let cartProducts = this.getCartFromStorage();
    if (!cartProducts) {
      this.localStore.saveData('cart', JSON.stringify([new_product]));
    } else {
      cartProducts = JSON.parse(this.localStore.getData('cart')!);
      cartProducts.push(new_product);
      this.localStore.saveData('cart', JSON.stringify(cartProducts));
    }
    this.calculateSum();
  }

  removeUserProduct(id: number) {
    this.userProducts.map((product) => {
      if (product.ID === id) {
        let sp = this.products.filter((p) => p.ID === id)[0];
        sp.Quantity += product.Quantity;
      }
    });
    this.userProducts = this.userProducts.filter(
      (product) => product.ID !== id
    );

    const cartProducts = this.getCartFromStorage();
    if (!cartProducts) return false;
    this.localStore.saveData('cart', JSON.stringify(this.userProducts));
    this.calculateSum();
    return true;
  }

  getCartProducts() {
    const cartProducts = this.getCartFromStorage();
    if (!cartProducts) return false;
    this.userProducts = cartProducts;
    this.userProducts.map((up) => {
      this.sum = this.sum + up.Price * up.Quantity;
      this.products.map((p) => {
        if (up.ID == p.ID) {
          p.Quantity -= up.Quantity;
        }
      });
    });
    return true;
  }

  getCartFromStorage() {
    if (!this.localStore.getData('cart')) {
      return false;
    } else {
      return JSON.parse(this.localStore.getData('cart')!);
    }
  }

  checkCoupon() {
    if (this.code == '') {
      return false;
    }
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    this.http
      .post(`https:/localhost:7154/api/CheckCoupon/${this.code}`, {
        headers: headers,
      })
      .subscribe({
        next: (response: any) => {
          this.discount = response.Discount;
          if (this.discounted) return;
          this.sum = this.sum - (this.sum * this.discount) / 100;
          this.discounted = true;
        },
        error: (response) => {
          this.discount = 0;
          this.discounted = false;
          this.calculateSum();
          this.code = '';
          console.log(response);
        },
      });
    return true;
  }

  buyProduct() {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    if (this.userProducts.length == 0) {
      return false;
    }
    if (this.sum > this.Balance) {
      return alert('Balance is not enough to buy products');
    }
    this.transactionS = {
      Paid: this.sum,
      Products: this.userProducts.map((pr) => {
        return { ID: pr.ID, Quantity: pr.Quantity };
      }),
      Coupon: this.code,
    };
    this.http
      .post(`https:/localhost:7154/api/BuyProducts`, this.transactionS, {
        headers: headers,
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.router.navigate(['/profile']);
        },
        error: (response) => console.log(response),
      });
    return true;
  }

  calculateSum() {
    this.sum = 0;
    if (this.discounted) {
      this.userProducts.map((up) => {
        this.sum = this.sum + up.Price * up.Quantity;
      });
      this.sum = this.sum - (this.sum * this.discount) / 100;
      this.discounted = true;
    } else {
      this.userProducts.map((up) => {
        this.sum = this.sum + up.Price * up.Quantity;
      });
    }
  }
}
