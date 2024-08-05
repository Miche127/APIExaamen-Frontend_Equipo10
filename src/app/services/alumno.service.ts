import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Alumno } from '../modals/Alumno.model';
import { inscripcion } from '../modals/inscripcion.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  private apiUrl = 'http://127.0.0.1:8000/api/alumnos';
  alumnos: Alumno[] = [];

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<Alumno> {
    return this.http.post<Alumno>('${this.apiUrl}', { email, password });
  }

  getAlumno(id: number): Observable<Alumno | null> {
    return this.http.get<Alumno[]>(this.apiUrl).pipe(
      map((alumnos: Alumno[]) => alumnos.find((alumno: Alumno) => alumno.id === id) || null)
    );
  }


  updateAlumno(alumno: Alumno): Observable<Alumno> {
    console.log(alumno);
    return this.http.put<Alumno>(`${this.apiUrl}/${alumno.id}`, alumno);
  }

  deleteAlumno(alumno: Alumno) {
    return this.http.delete(`http://127.0.0.1:8000/api/alumnos/${alumno.id}`);
  }

  deleteInscripcion(inscripcion: inscripcion){
    return this.http.delete(`http://127.0.0.1:8000/api/inscripciones/${inscripcion.id}`);
  }
  
}
