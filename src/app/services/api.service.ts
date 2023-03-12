import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private baseUrl = 'https://localhost:7154/api';

  constructor(private http: HttpClient) {}

  getUsers() {
    let url = this.baseUrl + 'GetUsers';
    return this.http.post(url, this.httpOptions);
    
  }
}
