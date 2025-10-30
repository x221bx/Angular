import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from './product.service';
import { CartService } from '../cart/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  category = '';
  private readonly destroyRef = inject(DestroyRef);
  showAddForm = false;
  newProduct = {
    title: '',
    description: '',
    price: 0,
    brand: '',
    category: '',
    image: ''
  };

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((qp) => {
      this.category = qp.get('category') || '';
      this.applyData();
    });

    this.productService.getProducts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.applyData(),
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load products';
        console.error(err);
      },
    });
  }

  private applyData(): void {
    const all = this.productService.getSnapshot();
    const list = this.category
      ? all.filter((p) => (p.category || '').toLowerCase() === this.category.toLowerCase())
      : all;
    this.products = list;
    this.loading = false;
    this.error = '';
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

  clearFilter(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }
}
