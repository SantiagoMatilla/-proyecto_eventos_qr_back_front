import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { EventoService } from '../../../../core/services/evento.service';
import { Categoria } from '../../../../core/models/categoria.model';
import { EventoRequest } from '../../../../core/models/evento-request.model';

// Funciones sueltas (no métodos de la clase) a propósito: un validador de formulario
// se pasa como referencia de función, y si fuera un método de la clase perdería el
// acceso a "this" al ser invocado por Angular. Al ser funciones independientes, no
// dependen de ningún "this" y no hay ese riesgo.

function combinarFechaHora(fecha: Date | null, hora: Date | null): Date | null {
  if (!fecha || !hora) return null;
  const combinado = new Date(fecha);
  combinado.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
  return combinado;
}

function formatearLocalDateTime(fecha: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:00`;
}

function parsearLocalDateTime(iso: string): Date {
  const [fechaTexto, horaTexto] = iso.split('T');
  const [anio, mes, dia] = fechaTexto.split('-').map(Number);
  const [horas, minutos] = horaTexto.split(':').map(Number);
  return new Date(anio, mes - 1, dia, horas, minutos);
}

function fechasYAccesoValidator(group: AbstractControl): ValidationErrors | null {
  const errores: Record<string, boolean> = {};

  const inicio = combinarFechaHora(
    group.get('fechaInicioFecha')?.value,
    group.get('fechaInicioHora')?.value,
  );
  const fin = combinarFechaHora(
    group.get('fechaFinFecha')?.value,
    group.get('fechaFinHora')?.value,
  );
  const controlFechaFinHora = group.get('fechaFinHora');

  if (inicio && fin && fin <= inicio) {
    controlFechaFinHora?.setErrors({ fechaFinInvalida: true });
    errores['fechaFinInvalida'] = true;
  } else if (controlFechaFinHora?.hasError('fechaFinInvalida')) {
    controlFechaFinHora.setErrors(null);
  }

  const tipoAcceso = group.get('tipoAcceso')?.value;
  const codigoAccesoControl = group.get('codigoAcceso');
  if (tipoAcceso === 'PRIVADO' && !codigoAccesoControl?.value) {
    codigoAccesoControl?.setErrors({ required: true });
    errores['codigoAccesoRequerido'] = true;
  } else if (tipoAcceso !== 'PRIVADO' && codigoAccesoControl?.hasError('required')) {
    codigoAccesoControl?.setErrors(null);
  }

  return Object.keys(errores).length ? errores : null;
}

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './evento-form.component.html',
  styleUrls: ['./evento-form.component.scss'],
})
export class EventoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  private eventoService = inject(EventoService);
  private cdr = inject(ChangeDetectorRef);

  categorias: Categoria[] = [];

  modoEdicion = signal(false);
  eventoId: number | null = null;

  cargandoEvento = signal(false);
  guardando = signal(false);
  errorCarga = signal<string | null>(null);
  errorGuardado = signal<string | null>(null);

  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;

  form: FormGroup = this.fb.group(
    {
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', Validators.required],
      categoriaId: [null, Validators.required],
      fechaInicioFecha: [null, Validators.required],
      fechaInicioHora: [null, Validators.required],
      fechaFinFecha: [null, Validators.required],
      fechaFinHora: [null, Validators.required],
      lugar: ['', [Validators.required, Validators.maxLength(150)]],
      direccion: [''],
      ciudad: [''],
      codigoPostal: [''],
      aforoMaximo: [null, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      tipoAcceso: ['PUBLICO', Validators.required],
      codigoAcceso: ['', Validators.maxLength(255)],
    },
    { validators: fechasYAccesoValidator },
  );

  ngOnInit(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cdr.detectChanges();
      },
      error: () => (this.categorias = []),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEdicion.set(true);
      this.eventoId = Number(idParam);
      this.cargarEvento(this.eventoId);
    }
  }

  private cargarEvento(id: number): void {
    this.cargandoEvento.set(true);
    this.eventoService.obtenerPorId(id).subscribe({
      next: (evento) => {
        this.form.patchValue({
          titulo: evento.titulo,
          descripcion: evento.descripcion,
          categoriaId: evento.categoriaId,
          fechaInicioFecha: parsearLocalDateTime(evento.fechaInicio),
          fechaInicioHora: parsearLocalDateTime(evento.fechaInicio),
          fechaFinFecha: parsearLocalDateTime(evento.fechaFin),
          fechaFinHora: parsearLocalDateTime(evento.fechaFin),
          lugar: evento.lugar,
          direccion: evento.direccion,
          ciudad: evento.ciudad,
          codigoPostal: evento.codigoPostal,
          aforoMaximo: evento.aforoMaximo,
          precio: evento.precio,
          tipoAcceso: evento.tipoAcceso,
        });
        if (evento.imagenUrl) {
          this.imagenPreview = `http://localhost:8080${evento.imagenUrl}`;
        }
        this.cargandoEvento.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorCarga.set('No se pudo cargar el evento. Puede que no exista o no sea tuyo.');
        this.cargandoEvento.set(false);
      },
    });
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(
        `La imagen pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB. El máximo permitido es 5 MB.`,
      );
      input.value = '';
      return;
    }

    this.imagenSeleccionada = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.guardando.set(true);
    this.errorGuardado.set(null);

    const request = this.construirRequest();
    const guardar$ = this.modoEdicion()
      ? this.eventoService.editar(this.eventoId!, request)
      : this.eventoService.crear(request);

    guardar$.subscribe({
      next: (evento) => {
        if (this.imagenSeleccionada) {
          this.eventoService.subirImagen(evento.id, this.imagenSeleccionada).subscribe({
            next: () => this.finalizarGuardado(),
            error: () => {
              this.errorGuardado.set(
                'El evento se guardó correctamente, pero hubo un problema al subir la imagen. Puedes editarlo y volver a intentarlo.',
              );
              this.guardando.set(false);
            },
          });
        } else {
          this.finalizarGuardado();
        }
      },
      error: (err) => {
        this.errorGuardado.set(err.error?.message || 'No se pudo guardar el evento.');
        this.guardando.set(false);
      },
    });
  }

  private construirRequest(): EventoRequest {
    const v = this.form.value;
    const fechaInicio = combinarFechaHora(v.fechaInicioFecha, v.fechaInicioHora)!;
    const fechaFin = combinarFechaHora(v.fechaFinFecha, v.fechaFinHora)!;

    return {
      titulo: v.titulo,
      descripcion: v.descripcion,
      categoriaId: v.categoriaId,
      fechaInicio: formatearLocalDateTime(fechaInicio),
      fechaFin: formatearLocalDateTime(fechaFin),
      lugar: v.lugar,
      direccion: v.direccion || undefined,
      ciudad: v.ciudad || undefined,
      codigoPostal: v.codigoPostal || undefined,
      aforoMaximo: v.aforoMaximo,
      precio: v.precio,
      tipoAcceso: v.tipoAcceso,
      codigoAcceso: v.tipoAcceso === 'PRIVADO' ? v.codigoAcceso : undefined,
    };
  }

  private finalizarGuardado(): void {
    this.guardando.set(false);
    this.router.navigate(['/organizador/mis-eventos']);
  }
}
