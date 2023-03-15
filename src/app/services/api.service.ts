import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    }),
  };
  private baseUrl = 'https://localhost:7154';
  private apiUrl = this.baseUrl + '/api';

  constructor(private http: HttpClient) {}

  getUsers() {
    let url = this.apiUrl + '/GetUsers';
    return this.http.post(url, this.httpOptions);
  }

  updateUser(data: User) {
    let url = this.apiUrl + '/UserUpdate';
    return this.http.post(url, data, this.httpOptions);
  }

  uploadFile(file: File) {
    let dbPath = '';
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post('https://localhost:7154/api/upload', formData);
  }
}
