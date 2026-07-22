import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Evento } from '../../../../core/models/evento.model';

@Component({
  selector: 'app-evento-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './evento-card.component.html',
  styleUrls: ['./evento-card.component.scss'],
})
export class EventoCardComponent {
  @Input({ required: true }) evento!: Evento;

  get imagenSrc(): string {
    return this.evento.imagenUrl
      ? `http://localhost:8080${this.evento.imagenUrl}`
      : 'assets/default-evento.svg';
  }

  get esGratis(): boolean {
    return this.evento.precio === 0;
  }
}
