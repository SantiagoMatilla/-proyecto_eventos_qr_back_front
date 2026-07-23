import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Evento, EstadoEvento } from '../models/evento.model';
import { EventoFiltro } from '../models/evento-filtro.model';
import { EventoRequest } from '../models/evento-request.model';
import { PageResponse } from '../models/page.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/eventos';
  private misEventosUrl = 'http://localhost:8080/api/mis-eventos';

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

  misEventos(page: number = 0, size: number = 10): Observable<PageResponse<Evento>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http
      .get<ApiResponse<PageResponse<Evento>>>(this.misEventosUrl, { params })
      .pipe(map((res) => res.data));
  }

  obtenerPorId(id: number): Observable<Evento> {
    return this.http.get<ApiResponse<Evento>>(`${this.apiUrl}/${id}`).pipe(map((res) => res.data));
  }

  crear(request: EventoRequest): Observable<Evento> {
    return this.http.post<ApiResponse<Evento>>(this.apiUrl, request).pipe(map((res) => res.data));
  }

  editar(id: number, request: EventoRequest): Observable<Evento> {
    return this.http
      .put<ApiResponse<Evento>>(`${this.apiUrl}/${id}`, request)
      .pipe(map((res) => res.data));
  }

  cambiarEstado(id: number, estado: EstadoEvento): Observable<Evento> {
    return this.http
      .patch<ApiResponse<Evento>>(`${this.apiUrl}/${id}/estado`, { estado })
      .pipe(map((res) => res.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(map(() => undefined));
  }

  subirImagen(id: number, file: File): Observable<Evento> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<ApiResponse<Evento>>(`${this.apiUrl}/${id}/imagen`, formData)
      .pipe(map((res) => res.data));
  }
}
