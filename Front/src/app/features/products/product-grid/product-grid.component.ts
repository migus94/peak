import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../cart/services/cart.service';
import { AuthService } from '../../auth/services/auth.service';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, ButtonModule, RatingModule, FormsModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.initCart();
    }
  }
  
  products = this.productService.products;

  goToDetail(id: number) {
    this.router.navigate(['/product', id]);
  }

  addToCart(productId: number) {
    this.cartService.updatecartItem(productId, true);
  }

}
