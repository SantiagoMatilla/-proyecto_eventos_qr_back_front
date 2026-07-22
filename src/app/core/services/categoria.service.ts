import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/categorias';

  listar(): Observable<Categoria[]> {
    return this.http.get<ApiResponse<Categoria[]>>(this.apiUrl).pipe(map((res) => res.data));
  }
}
