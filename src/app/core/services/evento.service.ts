import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Evento } from '../models/evento.model';
import { EventoFiltro } from '../models/evento-filtro.model';
import { PageResponse } from '../models/page.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/eventos';

  listarPublico(
    filtro: EventoFiltro,
    page: number = 0,
    size: number = 12,
  ): Observable<PageResponse<Evento>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (filtro.categoriaId != null) params = params.set('categoriaId', filtro.categoriaId);
    if (filtro.ciudad) params = params.set('ciudad', filtro.ciudad);
    if (filtro.precioPago != null) params = params.set('precioPago', filtro.precioPago);
    if (filtro.fechaDesde) params = params.set('fechaDesde', filtro.fechaDesde);
    if (filtro.fechaHasta) params = params.set('fechaHasta', filtro.fechaHasta);
    if (filtro.busqueda) params = params.set('busqueda', filtro.busqueda);
    if (filtro.sort) params = params.set('sort', filtro.sort);

    return this.http
      .get<ApiResponse<PageResponse<Evento>>>(this.apiUrl, { params })
      .pipe(map((res) => res.data));
  }

  obtenerPorId(id: number): Observable<Evento> {
    return this.http.get<ApiResponse<Evento>>(`${this.apiUrl}/${id}`).pipe(map((res) => res.data));
  }
}
