import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  username: string;
  email: string;
  phone: string;
  birthdate: string;
  role: string;
  profilePicture: string;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchEmail: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Use a relative path so it works with different base hrefs
    this.http.get<User[]>('assets/users.json').subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (err) => {
        console.error('Failed to load users.json from assets:', err);
      },
    });
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return '#dc3545'; // Red
      case 'user': return '#28a745'; // Green
      case 'moderator': return '#ffc107'; // Yellow/Orange
      default: return '#6c757d'; // Gray
    }
  }

  onSearch(): void {
    if (this.searchEmail.trim()) {
      this.filteredUsers = this.users.filter(user =>
        user.email.toLowerCase().includes(this.searchEmail.toLowerCase())
      );
    } else {
      this.filteredUsers = this.users;
    }
  }

  resetSearch(): void {
    this.searchEmail = '';
    this.filteredUsers = this.users;
  }
}
