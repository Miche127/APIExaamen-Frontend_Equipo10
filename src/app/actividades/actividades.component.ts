// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatCardModule } from '@angular/material/card';
// import { MatTableModule, MatTableDataSource } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';

// import { Actividad } from '../modals/actividad.model';

// @Component({
//   selector: 'app-actividades',
//   standalone: true,
//   imports:[ MatTableModule, MatButtonModule, MatCardModule],
//   templateUrl: './actividades.component.html',
//   styleUrl: './actividades.component.css'
// })
// export class ActividadesComponent {
//   activities = new MatTableDataSource<Actividad>();
//   displayedColumns: string[] = ['nombre', 'dia', 'hora', 'acciones'];

//   constructor(
//     private http: HttpClient,
//     private snackBar: MatSnackBar
//   ) {}

//   ngOnInit() {
//     this.http.get<Actividad[]>('http://127.0.0.1:8000/api/actividad').subscribe({
//       next: (data: Actividad[]) => {
//         console.log('Actividades:', data); // Verifica que sea un array de actividades
//         this.activities.data = data;
//       },
//       error: (err) => this.snackBar.open('Error al cargar actividades', 'Cerrar', { duration: 3000 })
//     });
//   }   
  

//   inscribe(actividadId: number) {
//     this.http.post(`http://127.0.0.1:8000/api/inscribir/${actividadId}`, {}).subscribe({
//       next: () => this.snackBar.open('Inscrito con éxito', 'Cerrar', { duration: 3000 }),
//       error: (err) => this.snackBar.open('Error al inscribirse', 'Cerrar', { duration: 3000 })
//     });
//   }
// }
