import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DiscountPricePipe } from '../discount-price-pipe';
import { Product, ProductService } from '../products/product.service';


@Component({
  selector: 'app-product-details',
  imports: [CommonModule, DiscountPricePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  product: Product | null = null;
  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getById(id) || null;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null; // prevent loop
    img.src = '/assets/images/placeholder.svg';
  }
}
