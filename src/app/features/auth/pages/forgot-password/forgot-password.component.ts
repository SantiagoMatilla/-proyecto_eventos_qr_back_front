import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  enviado = false;
  cargando = false;
  error: string | null = null;

  onSubmit(): void {
    if (this.form.invalid) return;

    this.cargando = true;
    this.error = null;

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        this.cargando = false;
        this.enviado = true;
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudo procesar la solicitud. Inténtalo de nuevo en unos minutos.';
      },
    });
  }
}
