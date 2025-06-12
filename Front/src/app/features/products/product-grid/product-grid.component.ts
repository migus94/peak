import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, ButtonModule],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent  {
  
  private productService = inject(ProductService);
  private router = inject(Router);

  products = this.productService.products;

  goToDetail(id: number) {
    this.router.navigate(['/product', id]);
  }

}
