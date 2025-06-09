import { Injectable, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RegisterFormService {

  private readonly fb = new FormBuilder();
  
  readonly registerForm = signal(
    this.fb.group({
      name: new FormControl( '', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('',{
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
      })
    })
  )

  getForm(): FormGroup {
    return this.registerForm();
  }

  resetForm(): void {
    this.registerForm().reset({
        email: '',
        password: '',
        name: ''
    });
  }

  canSubmit(form: FormGroup, isLoading: boolean): boolean {
    return form.valid && !isLoading;
  }

}
