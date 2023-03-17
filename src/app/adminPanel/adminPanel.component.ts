import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  ElementRef,
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
  @ViewChild('docAfterUploadBTN') docAfterUploadBTN:
    | ElementRef<HTMLButtonElement>
    | undefined;

  products: any = [];
  displayedColumns: string[] = ['id', 'name', 'quantity', 'price'];
  UserId: number = 0;
  editProduct: Product | undefined;

  documentUrl: string = 'დოკუმენტი';
  imageUrl: string = '';
  newProductForm: FormGroup;

  constructor(
    private storeService: StoreService,
    private localStore: LocalService,
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.newProductForm = new FormGroup({
      ID: !this.editProduct
        ? new FormControl(0)
        : new FormControl(this.editProduct?.ID),
      Name: new FormControl('', [Validators.required]),
      Quantity: new FormControl('', [Validators.required]),
      Price: new FormControl('', [Validators.required]),
      Image: new FormControl(''),
      Document: new FormControl(''),
    });
  }

  ngOnInit() {
    this.storeService.getStoreProducts().subscribe((data) => {
      this.products = data;
    });
  }
  onSubmit() {
    if (!this.newProductForm.valid) '';
    if (this.editProduct?.ID) {
      this.newProductForm.value.ID = this.editProduct.ID;
    }
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    // image and document
    console.log(this.DocFileUpload!.files[0]);
    if (this.DocFileUpload!.files.length > 0) {
      this.apiService.uploadFile(this.DocFileUpload!.files[0]).subscribe({
        next: (response: any) => {
          this.newProductForm.value.Document = response.dbPath;
        },
        error: (err) => console.log(err),
      });
    } else {
      this.newProductForm.value.Document =
        this.documentUrl == 'დოკუმენტი' ? '' : this.documentUrl;
    }
    if (this.ImgFileUpload!.files.length > 0) {
      this.apiService.uploadFile(this.ImgFileUpload!.files[0]).subscribe({
        next: (response: any) => {
          this.newProductForm.value.Image = response.dbPath;
        },
        error: (err) => console.log(err),
      });
    } else {
      this.newProductForm.value.Image = this.imageUrl;
    }
    setTimeout(() => {
      this.http
        .post(
          `https://localhost:7154/api/AddProduct/`,
          this.newProductForm.value,
          {
            headers: headers,
          }
        )
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
    }, 600);

    setTimeout(() => {
      this.storeService.getStoreProducts().subscribe((data) => {
        this.products = data;
      });
    }, 650);
  }

  onClear() {
    // this.newProductForm.reset();
    this.editProduct = undefined;
    this.DocFileUpload!.clear();
    this.ImgFileUpload!.clear();
    this.documentUrl = 'დოკუმენტი';
    this.imageUrl = '';
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

  onEdit(product: any) {
    this.editProduct = product;
    if (this.editProduct?.Document) {
      this.documentUrl = this.editProduct?.Document;
    } else {
      this.documentUrl = 'დოკუმენტი';
      this.DocFileUpload!.clear();
    }
    if (this.editProduct?.Image) {
      this.imageUrl = this.editProduct?.Image;
    } else {
      this.imageUrl = '';
      this.ImgFileUpload!.clear();
    }
  }

  getBackPath(path: string): string {
    return this.apiService.generateBackPath(path);
  }

  docSelected(event: any) {
    this.documentUrl = 'Resources\\Documents\\' + event.currentFiles[0].name;
  }

  docRemove() {
    this.DocFileUpload!.clear();
    // this.editProduct!.Document = '';
    this.documentUrl = 'დოკუმენტი';
  }

  removeImg(event: any) {
    this.ImgFileUpload!.clear();
    // this.editProduct!.Image = '';
    this.imageUrl = '';
  }

  nameFromPath(path: string | undefined) {
    if (!path) {
      return '';
    }
    var n = path.lastIndexOf('\\');
    var result = path.substring(n + 1);
    return result;
  }
}
