import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { User } from '../../../core/interfaces/user.interface';
import { Product } from '../../../core/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private readonly apiBase = '/api';
  private readonly productsUrl = '/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiBase}${this.productsUrl}`);
  }

  deleteProduts(id: string): Observable<any> {
    return this.http.delete(`${this.apiBase}${this.productsUrl}/${id}`);
  }

}
