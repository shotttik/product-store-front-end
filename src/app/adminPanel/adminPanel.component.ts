import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, SortEvent } from 'primeng/api';
import { Product } from 'src/app/interfaces/product';
import { StoreService } from 'src/app/services/store.service';
import { Coupon } from '../interfaces/coupons';
import { LocalService } from '../services/local.service';
import { Expiration, Discount } from '../interfaces/coupons';
import { AuthService } from '../services/auth.service';
import { FileUpload } from 'primeng/fileupload';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-adminPanel',
  templateUrl: './adminPanel.component.html',
  styleUrls: ['./adminPanel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  @ViewChild('DocFileUpload') DocFileUpload: FileUpload | undefined;
  @ViewChild('ImgFileUpload') ImgFileUpload: FileUpload | undefined;

  products: any = [];
  displayedColumns: string[] = ['id', 'name', 'quantity', 'price'];
  UserId: number = 0;

  id: number = 0;
  name: string | undefined = undefined;
  quantity: number | undefined = undefined;
  price: number | undefined = undefined;
  product: Product | undefined;

  newProductForm = new FormGroup({
    ID: this.id == 0 ? new FormControl(0) : new FormControl(this.id),
    Name: new FormControl('', [Validators.required]),
    Quantity: new FormControl('', [Validators.required]),
    Price: new FormControl('', [Validators.required]),
    Image: new FormControl(''),
    Document: new FormControl(''),
  });

  constructor(
    private storeService: StoreService,
    private localStore: LocalService,
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.storeService.getStoreProducts().subscribe((data) => {
      this.products = data;
    });
  }
  onSubmit() {
    if (!this.newProductForm.valid) '';
    if (this.id) {
      this.newProductForm.value.ID = this.id;
    }
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    // image and document

    if (this.DocFileUpload!.files.length > 0) {
      this.apiService.uploadFile(this.DocFileUpload!.files[0]).subscribe({
        next: (response: any) => {
          this.newProductForm.value.Document = response.dbPath;
        },
        error: (err) => console.log(err),
      });
    }
    if (this.ImgFileUpload!.files.length > 0) {
      this.apiService.uploadFile(this.ImgFileUpload!.files[0]).subscribe({
        next: (response: any) => {
          this.newProductForm.value.Image = response.dbPath;
        },
        error: (err) => console.log(err),
      });
    }
    let data = JSON.stringify(this.newProductForm.value);
    this.http
      .post(`https://localhost:7154/api/AddProduct/`, data, {
        headers: headers,
      })
      .subscribe({
        next: (response: any) =>
          this.messageService.add({
            severity: 'success',
            summary: 'ყურადღება!',
            detail: response.Message,
          }),
        error: (response) => {
          this.messageService.add({
            severity: 'error',
            summary: 'ყურადღება!',
            detail: response.Message,
          });
        },
      });

    setTimeout(() => {
      this.storeService.getStoreProducts().subscribe((data) => {
        this.products = data;
      });
    }, 100);
  }

  onClear() {
    // this.newProductForm.reset();
    this.id = 0;
    this.name = '';
    this.price = undefined;
    this.quantity = undefined;
  }

  onDelete(id: number) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    this.http
      .post(`https:/localhost:7154/api/DelProduct/${id}`, { headers: headers })
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'ყურადღება!',
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
    this.products = this.products.filter(
      (product: Product) => product.ID !== id
    );
  }

  onEdit(id: number, name: string, quantity: number, price: number) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.price = price;
  }

  onBasicUpload(event: any) {
    console.log(this.DocFileUpload!.files[0]);
    this.apiService.uploadFile(this.DocFileUpload!.files[0]);
    // this.apiService.uploadFile(this.ImgFileUpload!.files[0]);
  }
}
