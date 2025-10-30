import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Product {
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

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  products: Product[] = [
    {
      id: 1,
      title: "iPhone 9",
      description: "An apple mobile which is nothing like apple",
      price: 549,
      discountPercentage: 12.96,
      rating: 4.69,
      brand: "Apple",
      category: "smartphones",
      images: ["https://i.dummyjson.com/data/products/1/thumbnail.jpg"]
    },
    {
      id: 2,
      title: "iPhone X",
      description: "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip",
      price: 899,
      discountPercentage: 17.94,
      rating: 4.44,
      brand: "Apple",
      category: "smartphones",
      images: ["https://i.dummyjson.com/data/products/2/thumbnail.jpg"]
    },
    {
      id: 3,
      title: "Samsung Universe 9",
      description: "Samsung's new variant which goes beyond Galaxy to the Universe",
      price: 1249,
      discountPercentage: 15.46,
      rating: 4.09,
      brand: "Samsung",
      category: "smartphones",
      images: ["https://i.dummyjson.com/data/products/3/thumbnail.jpg"]
    },
    {
      id: 4,
      title: "OPPOF19",
      description: "OPPO F19 is officially announced on April 2021.",
      price: 280,
      discountPercentage: 17.91,
      rating: 4.3,
      brand: "OPPO",
      category: "smartphones",
      images: ["https://i.dummyjson.com/data/products/4/thumbnail.jpg"]
    },
    {
      id: 5,
      title: "Huawei P30",
      description: "Huawei’s re-badged P30 Pro New Edition was officially unveiled yesterday in Germany and now the device has made its way to the UK.",
      price: 499,
      discountPercentage: 10.58,
      rating: 4.09,
      brand: "Huawei",
      category: "smartphones",
      images: ["https://i.dummyjson.com/data/products/5/thumbnail.jpg"]
    }
  ];

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null; // prevent loop
    img.src = '/assets/images/placeholder.svg';
  }
}
