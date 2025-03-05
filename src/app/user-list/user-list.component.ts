import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  errorMessage: string = '';

  selectedUserId: number | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsersWithPosts().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load users. Please try again later.';
        console.error(err);
      }
    });
  }

  filterUsers(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  togglePosts(user: User): void {
    this.selectedUserId = this.selectedUserId === user.id ? null : user.id;
  }
}
