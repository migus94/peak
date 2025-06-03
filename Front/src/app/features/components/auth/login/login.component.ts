import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginFormService } from '../services/login-form.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  private formService = inject(LoginFormService);

  readonly form = this.formService.getForm();
  readonly isLoading = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly canSubmit = computed(()=> this.form.valid && this.form.dirty);

  login() {
    if (!this.canSubmit()) {return};
    this.errorMsg.set(null);
    this.isLoading.set(true);
    const {email, password} = this.form.getRawValue();

    this.authService.login(email, password). subscribe({
      next: () => {
        this.isLoading.set(false);
        this.formService.resetForm();
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.isLoading.set(false);
        e.status === 401 ? this.errorMsg.set('Credenciales invalidas')
          : this.errorMsg.set('Errro de servidor');
        }
      });
  };
}