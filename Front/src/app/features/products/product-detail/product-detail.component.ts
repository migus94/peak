import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ProductCommentsComponent } from '../product-comments/product-comments.component';
import { AuthService } from '../../auth/services/auth.service';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProductCommentsComponent, RatingModule,FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  isLogged = this.authService.isLoggedIn();

  readonly productId = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    ),
    {initialValue: 0}
  );

  readonly product = this.productService.getProductById(this.productId())
}
