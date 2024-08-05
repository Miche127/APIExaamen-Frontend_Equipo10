import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Actividad } from '../modals/actividad.model';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  private apiUrl = 'http://127.0.0.1:8000/api/actividad';

  constructor(private http: HttpClient) { }

  getActividades(): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(this.apiUrl);
  }
}
