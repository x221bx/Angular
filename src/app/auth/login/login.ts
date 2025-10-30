import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData: LoginData = {
    email: '',
    password: ''
  };

  constructor(private router: Router) { }

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Login data:', this.loginData);
      // Here you would typically call an authentication service
      alert('Login successful!');
      this.router.navigate(['/products']);
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
