import { computed, inject, Injectable, signal } from '@angular/core';
import { CartItem } from '../../../core/interfaces/cart.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);

  private readonly apiBase = '/api';
  private readonly cartRoute = '/cart';

  private readonly cartItems = signal<CartItem[]>([]);

  readonly cartCount = computed(() => {
    const items = this.cartItems();
    return Array.isArray(items)
      ? items.reduce((total, item) => total + item.quantity, 0)
      : 0;
  });

  readonly items = this.cartItems.asReadonly();

  constructor() {

  }

  initCart() {
    this.http.get<{ items: CartItem[] }>(`${this.apiBase}${this.cartRoute}`).pipe(
      map(res => res.items ?? []),
      catchError(() => of([]))
    ).subscribe(items => this.cartItems.set(items));
  }

  clearCart() {
    this.cartItems.set([]);
  }

  updatecartItem(productId: number, isIncrease: boolean) {
    const body = { isIncrease };

    this.http.put<{ items: CartItem[] }>(`${this.apiBase}${this.cartRoute}/${productId}`, body)
      .pipe(catchError(() => of(null)))
      .subscribe(resp => {
        if (resp) {
        this.initCart();
      }
      });
  }
}