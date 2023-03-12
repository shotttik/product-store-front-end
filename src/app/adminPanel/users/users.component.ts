import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { MessageService, SelectItem } from 'primeng/api';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  levels: SelectItem[] = [];
  clonedUser: { [s: string]: User } = {};

  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.apiService.getUsers().subscribe({
      next: (response: any) => (console.log(response), (this.users = response)),
      error: (response) => console.log(response),
    });
    this.levels = [
      { label: 'მომხმარებელი', value: 0 },
      { label: 'ადმინისტრატორი', value: 1 },
    ];
  }

  onRowEditInit(user: User) {
    this.clonedUser[user.id] = { ...user };
  }

  onRowEditSave(user: User, index: number) {
    if (user.balance < 0) {
      this.onSaveError(user, index);
      return;
    }
    if (user.isSuperUser == true && user.level == 0) {
      this.onSaveError(user, index);
      return;
    }

    delete this.clonedUser[user.id];

    this.apiService.updateUser(user).subscribe({
      next: (response: any) => response,
      error: (response) =>
        this.messageService.add({
          severity: 'error',
          summary: 'შეცდომა',
          detail: 'ბალანსი არავალიდურია',
        }),
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'მომხმარებელი განახლდა',
    });
  }

  onRowEditCancel(user: User, index: number) {
    this.users[index] = this.clonedUser[user.id];
    delete this.clonedUser[user.id];
  }

  onSaveError(user: User, index: number) {
    this.onRowEditCancel(user, index);
    this.messageService.add({
      severity: 'error',
      summary: 'შეცდომა',
      detail: 'არასწორი მონაცემები',
    });
  }
}
