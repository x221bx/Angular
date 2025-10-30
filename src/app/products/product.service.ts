import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

const STORAGE_KEY = 'app_products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly productsSubject = new BehaviorSubject<Product[]>(this.loadInitial());

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
    this.persist(next);
    return created;
  }

  private nextId(list: Product[]): number {
    return (list.reduce((max, p) => Math.max(max, p.id), 0) || 0) + 1;
  }

  private loadInitial(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw) as Product[];
        // Migrate any old external images to local product-specific assets
        const migrated = list.map((p) => this.toLocalImageIfNeeded(p));
        // Persist migration if any changes
        if (JSON.stringify(list) !== JSON.stringify(migrated)) {
          this.persist(migrated);
        }
        return migrated;
      }
    } catch { }
    return [
      {
        id: 1,
        title: 'iPhone 9',
        description: 'An apple mobile which is nothing like apple',
        price: 549,
        discountPercentage: 12.96,
        rating: 4.69,
        brand: 'Apple',
        category: 'smartphones',
        images: ['/assets/images/products/iphone-9.svg'],
      },
      {
        id: 2,
        title: 'iPhone X',
        description:
          'SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip',
        price: 899,
        discountPercentage: 17.94,
        rating: 4.44,
        brand: 'Apple',
        category: 'smartphones',
        images: ['/assets/images/products/iphone-x.svg'],
      },
      {
        id: 3,
        title: 'Samsung Universe 9',
        description: "Samsung's new variant which goes beyond Galaxy to the Universe",
        price: 1249,
        discountPercentage: 15.46,
        rating: 4.09,
        brand: 'Samsung',
        category: 'smartphones',
        images: ['/assets/images/products/samsung-universe-9.svg'],
      },
      {
        id: 4,
        title: 'OPPOF19',
        description: 'OPPO F19 is officially announced on April 2021.',
        price: 280,
        discountPercentage: 17.91,
        rating: 4.3,
        brand: 'OPPO',
        category: 'smartphones',
        images: ['/assets/images/products/oppo-f19.svg'],
      },
      {
        id: 5,
        title: 'Huawei P30',
        description:
          'Huawei’s re-badged P30 Pro New Edition was officially unveiled yesterday in Germany and now the device has made its way to the UK.',
        price: 499,
        discountPercentage: 10.58,
        rating: 4.09,
        brand: 'Huawei',
        category: 'smartphones',
        images: ['/assets/images/products/huawei-p30.svg'],
      },
    ];
  }

  private persist(list: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch { }
  }

  private toLocalImageIfNeeded(p: Product): Product {
    const usesExternal = p.images && p.images.some((u) => /^https?:\/\//.test(u));
    if (!usesExternal) return p;
    const mapById: Record<number, string> = {
      1: '/assets/images/products/iphone-9.svg',
      2: '/assets/images/products/iphone-x.svg',
      3: '/assets/images/products/samsung-universe-9.svg',
      4: '/assets/images/products/oppo-f19.svg',
      5: '/assets/images/products/huawei-p30.svg',
    };
    const local = mapById[p.id] || '/assets/images/placeholder.svg';
    return { ...p, images: [local] };
  }
}

