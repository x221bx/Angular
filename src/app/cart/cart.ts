import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from './cart.service';


@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe((list) => (this.cartItems = list));
  }

  increaseQuantity(index: number): void {
    const id = this.cartItems[index].id;
    this.cartService.increase(id);
  }

  decreaseQuantity(index: number): void {
    const id = this.cartItems[index].id;
    this.cartService.decrease(id);
  }

  removeItem(index: number): void {
    const id = this.cartItems[index].id;
    this.cartService.remove(id);
  }

  getTotalPrice(): number {
    return this.cartService.total();
  }

  checkout(): void {
    alert(`Checkout successful! Total: $${this.getTotalPrice()}`);
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null; // prevent loop
    img.src = '/assets/images/placeholder.svg';
  }
}
