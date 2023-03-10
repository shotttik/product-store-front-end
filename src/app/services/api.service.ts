import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  HEADERS = new HttpHeaders().set(
    'Content-Type',
    'application/json; charset=utf-8'
  );
  constructor(private http: HttpClient) {}

  getUsers() {
    this.http
      .post(`https://localhost:7154/api/GetUsers`, {
        headers: this.HEADERS,
      })
      .subscribe({
        next: (response: any) => console.log(response),
        error: (response) => console.log(response),
      });
  }
}
