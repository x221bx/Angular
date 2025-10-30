import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscountPricePipe } from '../discount-price-pipe';
import { Product, ProductService } from '../products/product.service';
import { CartService } from '../cart/cart.service';


@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule, FormsModule, DiscountPricePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  mainImage: string | null = null;
  qty = 1;
  added = false;
  related: Product[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getById(id) || null;
    this.mainImage = this.product?.images?.[0] ?? null;
    const all = this.productService.getSnapshot();
    this.related = all.filter(p => !this.product || p.id !== this.product.id).slice(0, 3);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null; // prevent loop
    img.src = '/assets/images/placeholder.svg';
  }

  selectImage(url: string): void {
    this.mainImage = url;
  }

  inc(): void {
    this.qty = Math.min(99, this.qty + 1);
  }

  dec(): void {
    this.qty = Math.max(1, this.qty - 1);
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addProduct(this.product, this.qty || 1);
    this.added = true;
    setTimeout(() => (this.added = false), 1200);
  }

  addToCartProduct(p: Product): void {
    this.cartService.addProduct(p, 1);
    this.added = true;
    setTimeout(() => (this.added = false), 1200);
  }
}
