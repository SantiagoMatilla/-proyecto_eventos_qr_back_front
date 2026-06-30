import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../core/services/usuario.service';
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
  private usuarioService = inject(UsuarioService);

  usuario: Usuario | null = null;
  perfilForm!: FormGroup;
  passwordForm!: FormGroup;

  // Variables para la gestión interactiva del avatar
  avatarPreview: string | null = null; // Guarda la imagen en Base64 para la vista previa
  imagenSeleccionada: File | null = null; // Guarda el archivo binario real listo para subir

  // URL base de tu API Gateway o servidor Spring Boot
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

    this.passwordForm = this.fb.group({
      passwordActual: ['', Validators.required],
      nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  private cargarPerfil(): void {
    this.usuarioService.getPerfil().subscribe({
      next: (user) => {
        this.usuario = user;

        // Rellenamos el formulario de texto
        this.perfilForm.patchValue({
          nombre: user.nombre,
          apellido: user.apellido,
          telefono: user.telefono,
        });

        // Si el usuario ya tiene una foto guardada en el backend, la asignamos a la vista previa
        if (user.avatarUrl) {
          this.avatarPreview = this.backendUrl + user.avatarUrl;
        }
      },
      error: (err) => console.error('Error al cargar perfil', err),
    });
  }

  onActualizarPerfil(): void {
    if (this.perfilForm.valid) {
      this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe({
        next: (user) => {
          this.usuario = user;
          alert('Perfil actualizado correctamente');
        },
        error: (err) => console.error('Error al actualizar', err),
      });
    }
  }

  onCambiarPassword(): void {
    if (this.passwordForm.valid) {
      this.usuarioService.cambiarPassword(this.passwordForm.value).subscribe({
        next: () => {
          alert('Contraseña cambiada correctamente');
          this.passwordForm.reset();
        },
        error: (err) => alert('Error al cambiar la contraseña. Verifica tu contraseña actual.'),
      });
    }
  }

  // 1. Captura el archivo local y genera la previsualización instantánea en el navegador
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;

      // FileReader lee el archivo del disco local sin subirlo aún al servidor
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string; // Transforma el binario a Base64 legible por el <img [src]>
      };
      reader.readAsDataURL(file);
    }
  }

  // 2. Se ejecuta al hacer clic en "Confirmar Nueva Foto". Hace el envío real al Backend
  guardarAvatar(): void {
    if (this.imagenSeleccionada) {
      this.usuarioService.subirAvatar(this.imagenSeleccionada).subscribe({
        next: (user) => {
          this.usuario = user;

          // Actualizamos el preview con la nueva ruta que nos devuelve el servidor remoto
          if (user.avatarUrl) {
            this.avatarPreview = this.backendUrl + user.avatarUrl;
          }

          this.imagenSeleccionada = null; // Escondemos el botón de confirmación hasta el siguiente cambio
          alert('¡Avatar actualizado y guardado con éxito!');
        },
        error: (err) => console.error('Error al subir avatar', err),
      });
    }
  }
}
