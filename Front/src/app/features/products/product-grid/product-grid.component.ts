import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent  {
  
  private productService = inject(ProductService);
  products = this.productService.prodducts;
}
