import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  brand: string;
  category: string;
  images: string[];
}

const USER_ADDED_KEY = 'app_products_user';
const API_URL = 'https://dummyjson.com/products?limit=20';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    this.fetchFromApi();
  }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getSnapshot(): Product[] {
    return this.productsSubject.getValue();
  }

  getById(id: number): Product | undefined {
    return this.getSnapshot().find((p) => p.id === id);
  }

  add(product: Omit<Product, 'id' | 'rating' | 'images'> & { images?: string[]; image?: string }): Product {
    const current = this.getSnapshot();
    const id = this.nextId(current);
    const images = product.images && product.images.length
      ? product.images
      : (product.image ? [product.image] : ['/assets/images/placeholder.svg']);
    const created: Product = {
      id,
      title: product.title,
      description: product.description,
      price: Number(product.price),
      discountPercentage: product.discountPercentage,
      rating: 0,
      brand: product.brand,
      category: product.category,
      images,
    };
    const next = [...current, created];
    this.productsSubject.next(next);
    this.persistUserAdded(created);
    return created;
  }

  private nextId(list: Product[]): number {
    return (list.reduce((max, p) => Math.max(max, p.id), 0) || 1000) + 1;
  }

  private fetchFromApi(): void {
    this.http.get<{ products: any[] }>(API_URL).subscribe({
      next: (res) => {
        const fetched = (res.products || []).map((raw) => this.mapApiProduct(raw));
        const userAdded = this.loadUserAdded();
        const merged = [...fetched, ...userAdded];
        this.productsSubject.next(merged);
      },
      error: (err) => {
        console.error('Failed to fetch products from API:', err);
        const userAdded = this.loadUserAdded();
        this.productsSubject.next(userAdded);
      },
    });
  }

  private mapApiProduct(raw: any): Product {
    const images: string[] = Array.isArray(raw.images) && raw.images.length
      ? raw.images
      : (raw.thumbnail ? [raw.thumbnail] : ['/assets/images/placeholder.svg']);
    return {
      id: Number(raw.id),
      title: String(raw.title ?? ''),
      description: String(raw.description ?? ''),
      price: Number(raw.price ?? 0),
      discountPercentage: raw.discountPercentage != null ? Number(raw.discountPercentage) : undefined,
      rating: Number(raw.rating ?? 0),
      brand: String(raw.brand ?? ''),
      category: String(raw.category ?? ''),
      images,
    };
  }

  private loadUserAdded(): Product[] {
    try {
      const raw = localStorage.getItem(USER_ADDED_KEY);
      return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
      return [];
    }
  }

  private persistUserAdded(p: Product): void {
    const list = this.loadUserAdded();
    list.push(p);
    try {
      localStorage.setItem(USER_ADDED_KEY, JSON.stringify(list));
    } catch {}
  }
}

