import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { Categoria } from '../../../../core/models/categoria.model';
import { EventoFiltro } from '../../../../core/models/evento-filtro.model';

@Component({
  selector: 'app-evento-filtros',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './evento-filtros.component.html',
  styleUrls: ['./evento-filtros.component.scss'],
})
export class EventoFiltrosComponent implements OnInit, OnDestroy {
  private categoriaService = inject(CategoriaService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  @Output() filtrosCambiados = new EventEmitter<EventoFiltro>();

  categorias: Categoria[] = [];

  busquedaControl = new FormControl('');
  ciudadControl = new FormControl('');

  categoriaSeleccionada: number | null = null;
  precioSeleccionado: 'todos' | 'gratis' | 'pago' = 'todos';
  ordenSeleccionado = 'fechaInicio,asc';

  get ordenIgnoraFiltros(): boolean {
    return this.ordenSeleccionado === 'inscritos';
  }

  ngOnInit(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cdr.detectChanges();
      },
      error: () => {
        this.categorias = [];
        this.cdr.detectChanges();
      },
    });

    this.busquedaControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.emitirFiltros());

    this.ciudadControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.emitirFiltros());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  seleccionarCategoria(categoriaId: number | null): void {
    this.categoriaSeleccionada = this.categoriaSeleccionada === categoriaId ? null : categoriaId;
    this.emitirFiltros();
  }

  seleccionarPrecio(valor: 'todos' | 'gratis' | 'pago'): void {
    this.precioSeleccionado = valor;
    this.emitirFiltros();
  }

  onCambioOrden(): void {
    if (this.ordenIgnoraFiltros) {
      this.busquedaControl.disable();
      this.ciudadControl.disable();
    } else {
      this.busquedaControl.enable();
      this.ciudadControl.enable();
    }
    this.emitirFiltros();
  }

  private emitirFiltros(): void {
    const filtro: EventoFiltro = {
      busqueda: this.busquedaControl.value || undefined,
      ciudad: this.ciudadControl.value || undefined,
      categoriaId: this.categoriaSeleccionada ?? undefined,
      precioPago:
        this.precioSeleccionado === 'todos' ? undefined : this.precioSeleccionado === 'pago',
      sort: this.ordenSeleccionado,
    };
    this.filtrosCambiados.emit(filtro);
  }
}
