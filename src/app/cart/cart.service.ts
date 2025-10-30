import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../products/product.service';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const STORAGE_KEY = 'app_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly subject = new BehaviorSubject<CartItem[]>(this.load());

  getCart(): Observable<CartItem[]> {
    return this.subject.asObservable();
  }

  snapshot(): CartItem[] {
    return this.subject.getValue();
  }

  addProduct(product: Product, quantity = 1): void {
    const list = [...this.snapshot()];
    const existing = list.find((i) => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      list.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || '/assets/images/placeholder.svg',
        quantity,
      });
    }
    this.commit(list);
  }

  remove(id: number): void {
    this.commit(this.snapshot().filter((i) => i.id !== id));
  }

  increase(id: number): void {
    const list = this.snapshot().map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
    this.commit(list);
  }

  decrease(id: number): void {
    const list = this.snapshot()
      .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
      .filter((i) => i.quantity > 0);
    this.commit(list);
  }

  total(): number {
    return this.snapshot().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  private commit(list: CartItem[]): void {
    this.subject.next(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CartItem[];
    } catch {}
    return [];
  }
}

