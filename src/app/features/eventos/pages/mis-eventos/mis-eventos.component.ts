import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EventoService } from '../../../../core/services/evento.service';
import { Evento, EstadoEvento } from '../../../../core/models/evento.model';

@Component({
  selector: 'app-mis-eventos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './mis-eventos.component.html',
  styleUrls: ['./mis-eventos.component.scss'],
})
export class MisEventosComponent implements OnInit {
  private eventoService = inject(EventoService);

  eventos = signal<Evento[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  totalElementos = signal(0);

  columnas = ['titulo', 'categoria', 'fechaInicio', 'estado', 'plazas', 'acciones'];

  pageSize = 10;
  pageActual = 0;

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.eventoService.misEventos(this.pageActual, this.pageSize).subscribe({
      next: (respuesta) => {
        this.eventos.set(respuesta.content);
        this.totalElementos.set(respuesta.totalElements);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar tus eventos. Inténtalo de nuevo más tarde.');
        this.cargando.set(false);
      },
    });
  }

  onCambioPagina(event: PageEvent): void {
    this.pageActual = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarEventos();
  }

  puedePublicar(evento: Evento): boolean {
    return evento.estado === 'BORRADOR';
  }

  puedeCancelar(evento: Evento): boolean {
    return evento.estado === 'PUBLICADO';
  }

  puedeEliminar(evento: Evento): boolean {
    return evento.estado === 'BORRADOR';
  }

  publicar(evento: Evento): void {
    if (!confirm(`¿Publicar "${evento.titulo}"? Será visible para todo el mundo.`)) return;
    this.cambiarEstado(evento, 'PUBLICADO');
  }

  cancelar(evento: Evento): void {
    if (!confirm(`¿Cancelar "${evento.titulo}"? Esta acción no se puede deshacer.`)) return;
    this.cambiarEstado(evento, 'CANCELADO');
  }

  eliminar(evento: Evento): void {
    if (!confirm(`¿Eliminar "${evento.titulo}" definitivamente? Esta acción no se puede deshacer.`))
      return;

    this.eventoService.eliminar(evento.id).subscribe({
      next: () => this.cargarEventos(),
      error: (err) => alert(err.error?.message || 'No se pudo eliminar el evento.'),
    });
  }

  private cambiarEstado(evento: Evento, nuevoEstado: EstadoEvento): void {
    this.eventoService.cambiarEstado(evento.id, nuevoEstado).subscribe({
      next: () => this.cargarEventos(),
      error: (err) => alert(err.error?.message || 'No se pudo cambiar el estado del evento.'),
    });
  }

  etiquetaEstado(estado: EstadoEvento): string {
    const etiquetas: Record<EstadoEvento, string> = {
      BORRADOR: 'Borrador',
      PUBLICADO: 'Publicado',
      CANCELADO: 'Cancelado',
      FINALIZADO: 'Finalizado',
    };
    return etiquetas[estado];
  }
}
