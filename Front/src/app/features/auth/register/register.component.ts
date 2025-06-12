import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormService } from '../services/register-form.service';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { RegisterRequest } from '../../../core/interfaces/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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


  readonly isValid = toSignal(
    this.form.statusChanges.pipe(
      startWith(this.form.status),
      map(status => status === 'VALID')
    ),
    {initialValue: this.form.status === 'VALID'}
  );

  readonly isDirty = toSignal(
    this.form.statusChanges.pipe(
      startWith(this.form.status),
      map(() => this.form.dirty)
    ),
    {initialValue: this.form.dirty}
  );

  readonly canSubmit = computed(()=> 
    this.isDirty() && this.isValid()
  );

  register(): void {
    if (!this.canSubmit()) {return};
    this.errorMsg.set(null);
    this.isLoading.set(true);
    
    const { name, email, password } = this.form.getRawValue() as RegisterRequest;

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
