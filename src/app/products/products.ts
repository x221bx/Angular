import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from './product.service';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  showAddForm = false;
  newProduct = {
    title: '',
    description: '',
    price: 0,
    brand: '',
    category: '',
    image: ''
  };

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (list) => {
        this.products = list;
        this.loading = false;
        this.error = '';
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load products';
        console.error(err);
      }
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null; // prevent loop
    img.src = '/assets/images/placeholder.svg';
  }

  toggleAdd(): void {
    this.showAddForm = !this.showAddForm;
  }

  addProduct(): void {
    if (!this.newProduct.title || !this.newProduct.price) return;
    this.productService.add(this.newProduct);
    this.newProduct = { title: '', description: '', price: 0, brand: '', category: '', image: '' };
    this.showAddForm = false;
  }

  addToCart(product: Product): void {
    this.cartService.addProduct(product, 1);
  }
}
