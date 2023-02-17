import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { LocalService } from './local.service';


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private http: HttpClient,
    private localStore: LocalService
  ) { }

  getStoreProducts(): Observable<Product[]> {

    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.
      get<Product[]>('https://localhost:7154/api/storeProducts', { headers: headers })

  }

  getUserProducts(id: number): Observable<Product[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.
      get<Product[]>(`https://localhost:7154/api/UserProduct/${id}`, { headers: headers })

  }

  getRandomString(length: number) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charLength = chars.length;
    let result = '';
    for (var i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;

  }

  getExpirationDate(days: number) {
    return new Date(Date.now() + (3600 * 1000 * 24 * days))
  }
}
