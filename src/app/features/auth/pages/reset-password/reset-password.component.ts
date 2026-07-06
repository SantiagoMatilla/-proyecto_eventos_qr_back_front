import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  form!: FormGroup;
  token: string | null = null;
  tokenAusente = false;
  cargando = false;
  completado = false;
  error: string | null = null;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.tokenAusente = true;
    }

    this.form = this.fb.group(
      {
        nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmarPassword: ['', Validators.required],
      },
      { validators: this.passwordsCoincidenValidator },
    );
  }

  private passwordsCoincidenValidator(group: AbstractControl): ValidationErrors | null {
    const nueva = group.get('nuevaPassword')?.value;
    const confirmacion = group.get('confirmarPassword')?.value;
    const controlConfirmacion = group.get('confirmarPassword');

    if (nueva !== confirmacion) {
      controlConfirmacion?.setErrors({ noCoincide: true });
      return { noCoincide: true };
    }
    if (controlConfirmacion?.hasError('noCoincide')) {
      controlConfirmacion.setErrors(null);
    }
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token) return;

    this.cargando = true;
    this.error = null;

    this.authService
      .resetPassword({
        token: this.token,
        nuevaPassword: this.form.value.nuevaPassword,
      })
      .subscribe({
        next: () => {
          this.cargando = false;
          this.completado = true;
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.cargando = false;
          this.error =
            err.error?.message ||
            'No se pudo restablecer la contraseña. El enlace puede haber caducado.';
        },
      });
  }
}
