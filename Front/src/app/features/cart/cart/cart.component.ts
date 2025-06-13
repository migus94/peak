import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CartService } from '../services/cart.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  
  items = this.cartService.items;
  
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.initCart();
    }
  }

  update(productId: number, isIncrease: boolean) {
  this.cartService.updatecartItem(productId, isIncrease);
}

// TODO vaciar del carrito y añadir imagenes
remove(productId: number) {
  this.cartService.updatecartItem(productId, false);
}

totalPrice(): number {
  return this.items().reduce((acc, item) => acc + item.price * item.quantity, 0);
}

}
