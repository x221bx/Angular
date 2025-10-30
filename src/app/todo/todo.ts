import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  assignedTo?: string; // username of the assigned user
}

interface User {
  username: string;
  email: string;
  phone: string;
  birthdate: string;
  role: string;
  profilePicture: string;
}

@Component({
  selector: 'app-todo',
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo implements OnInit {
  tasks: Task[] = [];
  newTaskText: string = '';
  selectedUser: string = '';
  users: User[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadTasks();
    this.loadUsers();
  }

  loadTasks(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }

  saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadUsers(): void {
    this.http.get<User[]>('/assets/users.json').subscribe(data => {
      this.users = data;
    });
  }

  addTask(): void {
    if (this.newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: this.newTaskText.trim(),
        completed: false,
        assignedTo: this.selectedUser || undefined
      };
      this.tasks.push(newTask);
      this.saveTasks();
      this.newTaskText = '';
      this.selectedUser = '';
    }
  }

  deleteTask(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.saveTasks();
  }

  toggleCompleted(taskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }
}
