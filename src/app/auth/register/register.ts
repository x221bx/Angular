import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      username: ['', [Validators.required, this.noSpacesValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
      addresses: this.fb.array([])
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for no spaces in username
  noSpacesValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.includes(' ')) {
      return { noSpaces: true };
    }
    return null;
  }

  // Custom validator for password strength
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecialChar = /[@$%#*!&]/.test(value);

    const passwordValid = hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar;
    return !passwordValid ? { passwordStrength: true } : null;
  }

  // Custom validator for password matching
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get addresses(): FormArray {
    return this.registerForm.get('addresses') as FormArray;
  }

  addAddress(): void {
    const addressGroup = this.fb.group({
      address: ['', Validators.required],
      street: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
    this.addresses.push(addressGroup);
  }

  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Registration data:', this.registerForm.value);
      alert('Registration successful!');
      this.router.navigate(['/login']);
    } else {
      this.markFormGroupTouched();
      alert('Please fill in all required fields correctly.');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
      if (control instanceof FormArray) {
        control.controls.forEach(ctrl => ctrl.markAsTouched());
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
