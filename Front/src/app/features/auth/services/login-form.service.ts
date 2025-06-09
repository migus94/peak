import { Injectable, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class LoginFormService {
    private readonly fb = new FormBuilder();

    readonly loginForm = signal(
        this.fb.group({
            email: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required, Validators.email]
            }),
            password: new FormControl('',{
                nonNullable: true,
                validators: [Validators.required, Validators.minLength(6)]
            })
        })
    );
    getForm(): FormGroup {
        return this.loginForm();
    }

    resetForm(): void {
        this.loginForm().reset({
            email: '',
            password: ''
        });
    }
}