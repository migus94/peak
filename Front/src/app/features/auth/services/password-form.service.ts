import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PasswordFormService {
  private fb = inject(FormBuilder);

  readonly form = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    onfirmNewPassword: ['', [Validators.required, Validators.minLength(6)]]
  });
}
