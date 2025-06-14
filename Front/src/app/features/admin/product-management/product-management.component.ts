import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProductsService } from '../services/products.service';
import { Product } from '../../../core/interfaces/product.interface';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.scss'
})
export class ProductManagementComponent {
  private productsService = inject(ProductsService);
  products: Product[] = [];

  ngOnInit(): void {
    this.loadProduts();
  }

  loadProduts() {
    this.productsService.getProducts().subscribe(products => {
      this.products = products
    });
  }

  deleteProduct(id: string) {
    this.productsService.deleteProduts(id).subscribe(() => this.loadProduts());
  }

}
