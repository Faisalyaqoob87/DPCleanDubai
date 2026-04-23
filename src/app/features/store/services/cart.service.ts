import { Injectable, computed, effect, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem, Product } from '../../../core/models/product.model';

const STORAGE_KEY = 'dpcleantechnicalservices-cart';

@Injectable({ providedIn: 'root' })
export class CartService {

  private platformId = inject(PLATFORM_ID);

  readonly cart = signal<CartItem[]>(this.loadCart());
  readonly itemCount = computed(() => this.cart().reduce((sum, item) => sum + item.qty, 0));
  readonly total = computed(() => this.cart().reduce((sum, item) => sum + item.price * item.qty, 0));

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cart()));
      }
    });
  }

  add(product: Product, qty = 1): void {
    this.cart.update((items) => {
      const match = items.find((item) => item.id === product.id);
      if (match) {
        return items.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...items, { ...product, qty }];
    });
  }

  updateQuantity(id: number, delta: number): void {
    this.cart.update((items) =>
      items
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  }

  remove(id: number): void {
    this.cart.update((items) => items.filter((item) => item.id !== id));
  }

  clear(): void {
    this.cart.set([]);
  }

  private loadCart(): CartItem[] {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}