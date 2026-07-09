import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild('loginFormEl') formElement!: ElementRef<HTMLFormElement>;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  errorMensaje = signal('');

  onSubmit() {
    const datosNativos = new FormData(this.formElement.nativeElement);
    const email = (datosNativos.get('email') as string) ?? '';
    const password = (datosNativos.get('password') as string) ?? '';

    this.loginForm.patchValue({ email, password });
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    this.errorMensaje.set('');
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMensaje.set('Credenciales incorrectas. Vuelve a intentarlo.');
        //console.error(err);
      },
    });
  }
}
