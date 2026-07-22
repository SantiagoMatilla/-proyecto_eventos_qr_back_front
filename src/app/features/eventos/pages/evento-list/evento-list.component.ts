import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventoService } from '../../../../core/services/evento.service';
import { Evento } from '../../../../core/models/evento.model';
import { EventoFiltro } from '../../../../core/models/evento-filtro.model';
import { EventoCardComponent } from '../../components/evento-card/evento-card.component';
import { EventoFiltrosComponent } from '../../components/evento-filtros/evento-filtros.component';

@Component({
  selector: 'app-evento-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    EventoCardComponent,
    EventoFiltrosComponent,
  ],
  templateUrl: './evento-list.component.html',
  styleUrls: ['./evento-list.component.scss'],
})
export class EventoListComponent implements OnInit {
  private eventoService = inject(EventoService);

  eventos = signal<Evento[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  totalElementos = signal(0);

  pageSize = 12;
  pageActual = 0;
  filtroActual: EventoFiltro = {};

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.eventoService.listarPublico(this.filtroActual, this.pageActual, this.pageSize).subscribe({
      next: (respuesta) => {
        this.eventos.set(respuesta.content);
        this.totalElementos.set(respuesta.totalElements);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los eventos. Inténtalo de nuevo más tarde.');
        this.cargando.set(false);
      },
    });
  }

  onFiltrosCambiados(filtro: EventoFiltro): void {
    this.filtroActual = filtro;
    this.pageActual = 0; // volvemos a la primera página cada vez que cambian los filtros
    this.cargarEventos();
  }

  onCambioPagina(event: PageEvent): void {
    this.pageActual = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarEventos();
  }
}
