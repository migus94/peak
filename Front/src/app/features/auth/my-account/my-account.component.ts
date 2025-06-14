import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PasswordFormService } from '../services/password-form.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>(); 

  private authService = inject(AuthService);
  readonly formService = inject(PasswordFormService);

  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  submit() {
    if (this.formService.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    const { currentPassword, newPassword } = this.formService.form.value;
    const id = Number(localStorage.getItem('userId'));

    const safeCurrentPassword = currentPassword ?? '';
    const safeNewPassword = newPassword ?? '';

    this.authService.changePassword(id, safeCurrentPassword, safeNewPassword).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        this.closeDialog()
      },
      error: (err) => {
        this.error.set('No se pudo cambiar la contraseña');
        this.loading.set(false);
      }
    });
  }

  onClose() {
    this.success.set(false);
    this.error.set(null);
    this.formService.form.reset();
    this.closeDialog();
  }

  closeDialog() {
    this.close.emit();
  }
}

