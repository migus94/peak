import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './product-comments.component.html',
  styleUrl: './product-comments.component.scss'
})
export class ProductCommentsComponent {

  @Input() canComment = false;

  comments = [
    { name: 'Lucas', rating: 5, text: 'Perfecto para mi tabla, llegó rápido y bien embalado.' },
    { name: 'María', rating: 4, text: 'Muy buena calidad, aunque el color no era igual al de la imagen.' },
    { name: 'David', rating: 5, text: 'Excelente relación calidad-precio. Muy recomendable.' }
  ];

  newComment = '';

  submitComment() {
    if (this.newComment.trim()) {
      this.comments.unshift({
        name: 'Anónimo',
        rating: 5,
        text: this.newComment.trim()
      });
      this.newComment = '';
    }
  }
}
