import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService); // Inyectamos el AuthService

  usuario: Usuario | null = null;
  perfilForm!: FormGroup;
  passwordForm!: FormGroup;

  avatarPreview: string | null = null;
  imagenSeleccionada: File | null = null;
  backendUrl = 'http://localhost:8080';

  ngOnInit(): void {
    this.initForms();
    this.cargarPerfil();
  }

  private initForms(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: [''],
    });

    this.passwordForm = this.fb.group(
      {
        passwordActual: ['', Validators.required],
        nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
        nuevaPasswordConfirm: ['', Validators.required],
      },
      { validators: this.passwordsCoincidenValidator },
    );
  }

  private passwordsCoincidenValidator(group: AbstractControl): ValidationErrors | null {
    const nueva = group.get('nuevaPassword')?.value;
    const confirmacion = group.get('nuevaPasswordConfirm')?.value;
    const controlConfirmacion = group.get('nuevaPasswordConfirm');

    if (nueva !== confirmacion) {
      controlConfirmacion?.setErrors({ noCoincide: true });
      return { noCoincide: true };
    }

    // Si ya coinciden, limpiamos ese error concreto (sin borrar el de "required" si el campo está vacío)
    if (controlConfirmacion?.hasError('noCoincide')) {
      controlConfirmacion.setErrors(null);
    }

    return null;
  }

  cargarPerfil(): void {
    this.usuarioService.getPerfil().subscribe({
      next: (user) => {
        this.usuario = user;
        this.authService.actualizarDatosUsuario(user); // Sincronizamos estado

        this.perfilForm.patchValue({
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          telefono: user.telefono || '',
        });

        if (user.avatarUrl) {
          const cleanUrl = user.avatarUrl.replace(/\s+/g, '%20');
          this.avatarPreview = `${this.backendUrl}${cleanUrl}?t=${new Date().getTime()}`;
        } else {
          this.avatarPreview = 'assets/default-avatar.png';
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar perfil:', err),
    });
  }

  onActualizarPerfil(): void {
    if (this.perfilForm.invalid) return;

    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe({
      next: (userActualizado) => {
        this.usuario = { ...userActualizado };
        this.authService.actualizarDatosUsuario(userActualizado); // Sincronizamos estado
        this.cdr.detectChanges();
        alert('Perfil actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar el perfil', err);
        alert('Hubo un error al guardar los cambios.');
      },
    });
  }

  onCambiarPassword(): void {
    if (this.passwordForm.valid) {
      const { passwordActual, nuevaPassword } = this.passwordForm.value;

      this.usuarioService.cambiarPassword({ passwordActual, nuevaPassword }).subscribe({
        next: () => {
          alert('Contraseña cambiada correctamente');
          this.passwordForm.reset();
        },
        error: (err) => alert('Error al cambiar la contraseña.'),
      });
    }
  }

  private readonly MAX_AVATAR_SIZE_MB = 5;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const maxSizeBytes = this.MAX_AVATAR_SIZE_MB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      const pesoMb = (file.size / (1024 * 1024)).toFixed(1);
      alert(`La imagen pesa ${pesoMb} MB. El máximo permitido es ${this.MAX_AVATAR_SIZE_MB} MB.`);
      event.target.value = ''; // limpiamos el input para poder volver a seleccionar
      return;
    }

    this.imagenSeleccionada = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  guardarAvatar(): void {
    if (!this.imagenSeleccionada) return;

    this.usuarioService.subirAvatar(this.imagenSeleccionada).subscribe({
      next: (userActualizado) => {
        this.usuario = { ...userActualizado };
        this.authService.actualizarDatosUsuario(userActualizado); // Sincronizamos estado

        if (userActualizado.avatarUrl) {
          const cleanUrl = userActualizado.avatarUrl.replace(/\s+/g, '%20');
          this.avatarPreview = `${this.backendUrl}${cleanUrl}?t=${new Date().getTime()}`;
        }

        this.imagenSeleccionada = null;
        this.cdr.detectChanges();
        alert('Foto guardada correctamente');
      },
      error: (err) => {
        console.error('Error al subir avatar:', err);
        alert('Error al guardar la foto.');
      },
    });
  }
}
