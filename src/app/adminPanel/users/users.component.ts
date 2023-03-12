import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any;
  constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    this.users = this.apiService.getUsers().subscribe({
      next: (response: any) => this.users = response,
      error: (response) => console.log(response),
    });
  }

}
