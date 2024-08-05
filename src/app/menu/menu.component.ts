import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActividadService } from '../services/actividad.service';
import { Alumno } from '../modals/Alumno.model';
import { Actividad } from '../modals/actividad.model';
import { AlumnoService } from '../services/alumno.service';

import { SharedService } from '../services/share.service';
import { inscripcion } from '../modals/inscripcion.model';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  alumno: Alumno = {
    id: 0,
    numeroControl: 0,
    nombres: '',
    apellidoP: '',
    apellidoM: '',
    correo: '',
    contrasena: '',
    inscrito: 0
  };

  inscripcion: inscripcion = {
    id: 0,
    numeroControl: this.alumno.id,
    id_actividad: 0,
  };

  activities = new MatTableDataSource<Actividad>();
  displayedColumns: string[] = ['id', 'nombre', 'dia', 'hora', 'acciones'];

  actividades: Actividad[] = [];
  mostrarDatos: boolean = false;
  mostrarActividad: boolean = false;

  mostrarMisActividades: boolean = false;
  actividadInscrita: Actividad | null = null;

  registroInscripcion: inscripcion | null = null;

  alumno2: Alumno[] = [];


  constructor(
    private router: Router,
    private alumnoService: AlumnoService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    private dialog: MatDialog

  ) { }

  mostrarDatosAlumno(): void {
    this.mostrarDatos = true;
    this.mostrarActividad = false;

    this.mostrarMisActividades = false;

  }

  mostrarActividades(): void {
    this.mostrarDatos = false;

    this.mostrarMisActividades = false;

    if (this.sharedService.getInscritoPerfil() == 0) {
      this.mostrarActividad = true;
    } else {
      this.snackBar.open('Ya te encuentras inscrito a una actividad', 'cerrar', { duration: 3000 });
    }
  }

  mostrarMiActividad(): void {
    this.mostrarDatos = false;
    this.mostrarActividad = false;
    console.log(this.sharedService.getInscritoPerfil());
    if (this.sharedService.getInscritoPerfil() == 1) {
      this.mostrarMisActividades = true;
      this.http.get<inscripcion>(`http://127.0.0.1:8000/api/inscripciones`).subscribe((response: any) => {
        const registro = response.find((u: any) => u.numeroControl === this.alumno.numeroControl);
        console.log(registro);
        if (registro) {
          this.http.get<Actividad>(`http://127.0.0.1:8000/api/actividades`).subscribe((response: any) => {
            const act = response.find((u: any) => u.id === registro.id_actividad);
            console.log(act);
            if (act) {
              console.log(act);
              this.actividadInscrita = act;
            }else{}
          });
        }else{
          console.log('ufhwefuiUIIUEFHIWUEFHUIWEHFUI74678887');
        }
      });


    } else {
      this.snackBar.open('No estás inscrito en ninguna actividad', 'Cerrar', { duration: 3000 });
    }
  }

  // actualizarAlumno(): void {
  //   console.log(`MenuComponent:   `);
  //   console.log(this.alumno);
  //   let enviarAlumno = {
  //     id: this.alumno.id,
  //     numeroControl: this.alumno.numeroControl,
  //     nombres: this.alumno.nombres,
  //     apellidoP: this.alumno.apellidoP,
  //     apellidoM: this.alumno.apellidoM,
  //     correo: this.alumno.correo,
  //     contrasena: this.alumno.contrasena,
  //     inscrito: this.alumno.inscrito
  //   };
  //   this.alumnoService.updateAlumno(enviarAlumno).subscribe({
  //     next: (data: Alumno) => {
  //       this.snackBar.open('Datos actualizados', 'Cerrar', { duration: 3000 });
  //     },
  //     error: (err) => {
  //       console.error('Error al actualizar los datos del alumno:', err);
  //       this.snackBar.open('Error al actualizar datos del alumno', 'Cerrar', { duration: 3000 });
  //     }
  //   });
  // }


  ngOnInit() {
    const correoPerfil = this.sharedService.getCorreoPerfil();
    const inscritoPerfil = this.sharedService.getInscritoPerfil();
    console.log(correoPerfil);

    this.alumnoService.getAlumno(correoPerfil).subscribe({
      next: (data: Alumno | null) => {
        if (data) {
          this.alumno = data;
          console.log(this.alumno);
          this.sharedService.setInscritoPerfil(this.alumno.inscrito);
        } else {
          this.snackBar.open('No se encontró el alumno', 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => this.snackBar.open('Error al cargar datos del alumno', 'Cerrar', { duration: 3000 })
    });

    // Obtener actividades
    this.http.get<Alumno[]>('http://127.0.0.1:8000/api/alumnos').subscribe((response: any) => {
      const user = response.find((u: any) => u.email === correoPerfil);
      this.alumno2 = user ? [user] : [];
      console.log(this.alumno2);
    });
    this.http.get<Actividad[]>('http://127.0.0.1:8000/api/actividades').subscribe({
      next: (data: Actividad[]) => {
        this.activities.data = data;
      },
      error: (err) => this.snackBar.open('Error al cargar actividades', 'Cerrar', { duration: 3000 })
    });
  }

  // inscribe(numeroControl: number, id_actividad: number) {
  //   console.log('Número de Control:', numeroControl);
  //   console.log('Actividad ID:', id_actividad);
  //   let enviarAlumno = {
  //     id: this.alumno.id,
  //     numeroControl: this.alumno.numeroControl,
  //     nombres: this.alumno.nombres,
  //     apellidoP: this.alumno.apellidoP,
  //     apellidoM: this.alumno.apellidoM,
  //     correo: this.alumno.correo,
  //     contrasena: this.alumno.contrasena,
  //     inscrito: this.alumno.inscrito
  //   };
  //   if (this.alumno.inscrito == 0) {
  //     enviarAlumno.inscrito = 1;
  //     this.sharedService.setInscritoPerfil(1);
  //     this.alumnoService.updateAlumno(enviarAlumno).subscribe({
  //       next: (data: Alumno) => {
  //         this.snackBar.open('Datos actualizados', 'Cerrar', { duration: 3000 });
  //       },
  //       error: (err) => {
  //         console.error('Error al actualizar los datos del alumno:', err);
  //         this.snackBar.open('Error al actualizar datos del alumno', 'Cerrar', { duration: 3000 });
  //       }
  //     });

  //     this.inscripcion.id_actividad = id_actividad;
  //     this.inscripcion.numeroControl = numeroControl;
  //     this.http.post('http://127.0.0.1:8000/api/inscripciones', this.inscripcion).subscribe({
  //       next: (response: any) => {
  //         console.log('Respuesta del API:', response);
  //         this.snackBar.open('Inscripcion exitosa', 'Cerrar', { duration: 3000 });
  //         // this.toggleMode();
  //       },
  //       error: (err) => {
  //         console.error('Error al inscribirte a la actividad.', err);
  //         if (err.error) {
  //           console.error('Detalles del error:', err.error);
  //         }
  //         this.snackBar.open('Error al inscribirte a la actividad.', 'Cerrar', { duration: 3000 });
  //       }
  //     });
  //     // this.mostrarMiActividad();

  //   } else {
  //     this.snackBar.open('Ya te encuentras inscrito a una actividad', 'cerrar');
  //   }
  // }

  // darDeBaja(): void {
  //   let enviarAlumno = {
  //     id: this.alumno.id,
  //     numeroControl: this.alumno.numeroControl,
  //     nombres: this.alumno.nombres,
  //     apellidoP: this.alumno.apellidoP,
  //     apellidoM: this.alumno.apellidoM,
  //     correo: this.alumno.correo,
  //     contrasena: this.alumno.contrasena,
  //     inscrito: this.alumno.inscrito
  //   };
  //   enviarAlumno.inscrito = 0;
  //   this.alumno.inscrito=0;
  //     this.sharedService.setInscritoPerfil(0);
  //     this.alumnoService.updateAlumno(enviarAlumno).subscribe({
  //       next: (data: Alumno) => {
  //         this.snackBar.open('Haz dado de baja de la actividad.', 'Cerrar', { duration: 3000 });
  //       },
  //       error: (err) => {
  //         console.error('Error al actualizar los datos del alumno:', err);
  //         this.snackBar.open('Error al actualizar datos del alumno', 'Cerrar', { duration: 3000 });
  //       }
  //     });

      
  //     this.http.get<inscripcion>(`http://127.0.0.1:8000/api/inscripciones`).subscribe((response: any) => {
  //       const registro = response.find((u: any) => u.numeroControl === this.alumno.numeroControl);
        
  //       this.inscripcion=registro;
  //       if (registro) {
  //         console.log(this.inscripcion);
  //         this.alumnoService.deleteInscripcion(this.inscripcion).subscribe({
  //           next: () => {
  //             this.snackBar.open('Baja existosa', 'Cerrar', { duration: 3000 });
  //             this.router.navigate(['/menu']);
  //           },
  //           error: (err) => {
  //             console.error('Error al dar de baja actividad:', err);
  //             this.snackBar.open('Error dar de baja actividad', 'Cerrar', { duration: 3000 });
  //           }
  //         });
  //       }else{
  //         console.log('ufhwefuiUIIUEFHIWUEFHUIWEHFUI74678887');
  //       }
  //     });
  //     this.mostrarMiActividad();
  // }

  // cerrarSesion() {
  //   this.router.navigate(['/log']);
  // }


  // eliminarAlumno(): void {
  //   this.alumnoService.deleteAlumno(this.alumno).subscribe({
  //     next: () => {
  //       this.snackBar.open('Alumno eliminado', 'Cerrar', { duration: 3000 });
  //       this.router.navigate(['/log']);
  //     },
  //     error: (err) => {
  //       console.error('Error al eliminar el alumno:', err);
  //       this.snackBar.open('Error al eliminar el alumno', 'Cerrar', { duration: 3000 });
  //     }
  //   });
  // }

  confirmarAccion(mensaje: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: mensaje }
    });

    return dialogRef.afterClosed().toPromise();
  }

  async actualizarAlumno(): Promise<void> {
    const confirmado = await this.confirmarAccion('¿Está seguro de actualizar el alumno?');
    if (confirmado) {
      console.log(`MenuComponent:   `);
      console.log(this.alumno);
      let enviarAlumno = {
            id: this.alumno.id,
            numeroControl: this.alumno.numeroControl,
            nombres: this.alumno.nombres,
            apellidoP: this.alumno.apellidoP,
            apellidoM: this.alumno.apellidoM,
            correo: this.alumno.correo,
            contrasena: this.alumno.contrasena,
            inscrito: this.alumno.inscrito
          };
          enviarAlumno.inscrito = 0;
          this.alumno.inscrito=0;
            this.sharedService.setInscritoPerfil(0);
            this.alumnoService.updateAlumno(enviarAlumno).subscribe({
              next: (data: Alumno) => {
                this.snackBar.open('Haz dado de baja de la actividad.', 'Cerrar', { duration: 3000 });
              },
              error: (err) => {
                console.error('Error al actualizar los datos del alumno:', err);
                this.snackBar.open('Error al actualizar datos del alumno', 'Cerrar', { duration: 3000 });
              }
            });
      
            
            this.http.get<inscripcion>(`http://127.0.0.1:8000/api/inscripciones`).subscribe((response: any) => {
              const registro = response.find((u: any) => u.numeroControl === this.alumno.numeroControl);
              
              this.inscripcion=registro;
              if (registro) {
                console.log(this.inscripcion);
                this.alumnoService.deleteInscripcion(this.inscripcion).subscribe({
                  next: () => {
                    this.snackBar.open('Baja existosa', 'Cerrar', { duration: 3000 });
                    this.router.navigate(['/menu']);
                  },
                  error: (err) => {
                    console.error('Error al dar de baja actividad:', err);
                    this.snackBar.open('Error dar de baja actividad', 'Cerrar', { duration: 3000 });
                  }
                });
              }else{
                console.log('ufhwefuiUIIUEFHIWUEFHUIWEHFUI74678887');
              }
            });
            this.mostrarMiActividad();
        
    }
  }




  async eliminarAlumno(): Promise<void> {
    const confirmado = await this.confirmarAccion('¿Está seguro de eliminar el alumno?');
    if (confirmado) {
      this.alumnoService.deleteAlumno(this.alumno).subscribe({
        next: () => {
          this.snackBar.open('Alumno eliminado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/log']);
        },
        error: (err) => {
          console.error('Error al eliminar el alumno:', err);
          this.snackBar.open('Error al eliminar el alumno', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
  
  async inscribe(numeroControl: number, id_actividad: number): Promise<void> {
    const confirmado = await this.confirmarAccion('¿Está seguro de inscribirse en esta actividad?');
    if (confirmado) {
      console.log('Número de Control:', numeroControl);
    console.log('Actividad ID:', id_actividad);
    let enviarAlumno = {
      id: this.alumno.id,
      numeroControl: this.alumno.numeroControl,
      nombres: this.alumno.nombres,
      apellidoP: this.alumno.apellidoP,
      apellidoM: this.alumno.apellidoM,
      correo: this.alumno.correo,
      contrasena: this.alumno.contrasena,
      inscrito: this.alumno.inscrito
    };
    if (this.alumno.inscrito == 0) {
      enviarAlumno.inscrito = 1;
      this.sharedService.setInscritoPerfil(1);
      this.alumnoService.updateAlumno(enviarAlumno).subscribe({
        next: (data: Alumno) => {
          this.snackBar.open('Datos actualizados', 'Cerrar', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error al actualizar los datos del alumno:', err);
          this.snackBar.open('Error al actualizar datos del alumno', 'Cerrar', { duration: 3000 });
        }
      });

      this.inscripcion.id_actividad = id_actividad;
      this.inscripcion.numeroControl = numeroControl;
      this.http.post('http://127.0.0.1:8000/api/inscripciones', this.inscripcion).subscribe({
        next: (response: any) => {
          console.log('Respuesta del API:', response);
          this.snackBar.open('Inscripcion exitosa', 'Cerrar', { duration: 3000 });
          // this.toggleMode();
        },
        error: (err) => {
          console.error('Error al inscribirte a la actividad.', err);
          if (err.error) {
            console.error('Detalles del error:', err.error);
          }
          this.snackBar.open('Error al inscribirte a la actividad.', 'Cerrar', { duration: 3000 });
        }
      });
      // this.mostrarMiActividad();

    } else {
      this.snackBar.open('Ya te encuentras inscrito a una actividad', 'cerrar');
    }
    }
  }
  
  async cerrarSesion(): Promise<void> {
    const confirmado = await this.confirmarAccion('¿Está seguro de cerrar sesión?');
    if (confirmado) {
      this.router.navigate(['/log']);
    }
  }

  async darDeBaja(): Promise<void> {
    const confirmado = await this.confirmarAccion('¿Está seguro que quieres dar de baja esta actividad?');

    let enviarAlumno = {
          id: this.alumno.id,
          numeroControl: this.alumno.numeroControl,
          nombres: this.alumno.nombres,
          apellidoP: this.alumno.apellidoP,
          apellidoM: this.alumno.apellidoM,
          correo: this.alumno.correo,
          contrasena: this.alumno.contrasena,
          inscrito: this.alumno.inscrito
        };
        enviarAlumno.inscrito = 0;
        this.alumno.inscrito=0;
          this.sharedService.setInscritoPerfil(0);
          this.alumnoService.updateAlumno(enviarAlumno).subscribe({
            next: (data: Alumno) => {
              this.snackBar.open('Haz dado de baja de la actividad.', 'Cerrar', { duration: 3000 });
            },
            error: (err) => {
              console.error('Error al actualizar los datos del alumno:', err);
              this.snackBar.open('Error al actualizar datos del alumno', 'Cerrar', { duration: 3000 });
            }
          });
    
          
          this.http.get<inscripcion>(`http://127.0.0.1:8000/api/inscripciones`).subscribe((response: any) => {
            const registro = response.find((u: any) => u.numeroControl === this.alumno.numeroControl);
            
            this.inscripcion=registro;
            if (registro) {
              console.log(this.inscripcion);
              this.alumnoService.deleteInscripcion(this.inscripcion).subscribe({
                next: () => {
                  this.snackBar.open('Baja existosa', 'Cerrar', { duration: 3000 });
                  this.router.navigate(['/menu']);
                },
                error: (err) => {
                  console.error('Error al dar de baja actividad:', err);
                  this.snackBar.open('Error dar de baja actividad', 'Cerrar', { duration: 3000 });
                }
              });
            }else{
              console.log('ufhwefuiUIIUEFHIWUEFHUIWEHFUI74678887');
            }
          });
          this.mostrarMiActividad();
      
  }
}