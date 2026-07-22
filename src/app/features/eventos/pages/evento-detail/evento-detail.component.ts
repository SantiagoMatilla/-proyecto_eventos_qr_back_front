import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { EventoService } from '../../../../core/services/evento.service';
import { Evento } from '../../../../core/models/evento.model';

@Component({
  selector: 'app-evento-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './evento-detail.component.html',
  styleUrls: ['./evento-detail.component.scss'],
})
export class EventoDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private eventoService = inject(EventoService);
  private sanitizer = inject(DomSanitizer);

  evento = signal<Evento | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  mapaUrl = signal<SafeResourceUrl | null>(null);

  backendUrl = 'http://localhost:8080';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Evento no válido.');
      this.cargando.set(false);
      return;
    }
    this.cargarEvento(id);
  }

  cargarEvento(id: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.eventoService.obtenerPorId(id).subscribe({
      next: (evento) => {
        this.evento.set(evento);
        this.construirMapa(evento);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el evento. Puede que ya no exista o no esté disponible.');
        this.cargando.set(false);
      },
    });
  }

  private construirMapa(evento: Evento): void {
    const direccionCompleta = `${evento.direccion}, ${evento.ciudad}`;
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&output=embed`;
    this.mapaUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  get imagenSrc(): string {
    const ev = this.evento();
    return ev?.imagenUrl ? `${this.backendUrl}${ev.imagenUrl}` : 'assets/default-evento.svg';
  }

  get esGratis(): boolean {
    return this.evento()?.precio === 0;
  }
}
