import { Component, computed, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterFormService } from '../services/register-form.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private formService = inject(RegisterFormService);

  readonly form = this.formService.getForm();
  readonly isLoading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly canSubmit = computed(()=> 
    this.form.valid && this.form.dirty && !this.isLoading()
  );

  register(): void {
    if (!this.canSubmit()) {return};
    this.errorMsg.set(null);
    this.isLoading.set(true);
    
    const { name, email, password } = this.form.getRawValue();

    this.authService.register({name, email, password}).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.formService.resetForm();
        this.router.navigate(['/login']);
      },
      error: (e) => {
        this.isLoading.set(false);
        this.errorMsg.set(e.error?.message || 'Error en el registro');
      }
    });
  }
}
