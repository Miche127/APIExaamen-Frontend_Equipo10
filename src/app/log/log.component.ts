import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Alumno } from '../modals/Alumno.model';

import { SharedService } from '../services/share.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent {

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

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);
  readonly name = new FormControl('', [Validators.required]);
  readonly control = new FormControl('', [Validators.required]);
  readonly paterno = new FormControl('', [Validators.required]);
  readonly materno = new FormControl('', [Validators.required]);

  hide = signal(true);
  isLoginMode = signal(true);

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {}

  togglePasswordVisibility() {
    this.hide.set(!this.hide());
  }

  toggleMode() {
    this.isLoginMode.set(!this.isLoginMode());
  }

  login() {
    if (this.email.valid && this.password.valid) {
      console.log('Email:', this.email.value);
      console.log('Password:', this.password.value);
      
      this.http.get('http://127.0.0.1:8000/api/alumnos').subscribe({
        next: (response: any) => {
          console.log('API Response:', response);
          
          // Asegúrate de que los nombres de las propiedades coincidan con los del backend
          const user = response.find((u: any) => u.correo === this.email.value && u.contrasena === this.password.value);
          console.log('Found User:', user);
          
          if (user) {
            this.sharedService.setCorreoPerfil(user.id);
            this.router.navigate(['/menu']);
          } else {
            this.snackBar.open('Datos inválidos', 'Cerrar', { duration: 3000 });
          }
        },
        error: (err) => {
          console.error('Error al conectar con el servidor:', err);
          this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Por favor complete todos los campos correctamente', 'Cerrar', { duration: 3000 });
    }
  }
  
  

  // register() {
  //   console.log("Resgistrar");
  //   if (this.control.valid && this.name.valid && this.paterno.valid && this.materno.valid && this.email.valid && this.password.valid) {
  
  //     console.log('Datos enviados:', this.alumno);
  
  //     this.http.post('http://127.0.0.1:8000/api/alumnos', this.alumno).subscribe({
  //       next: (response: any) => {
  //         console.log('Respuesta del API:', response);
  //         this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
  //         this.toggleMode();
  //       },
  //       error: (err) => {
  //         console.error('Error al registrar el alumno:', err);
  //         if (err.error) {
  //           console.error('Detalles del error:', err.error);
  //         }
  //         this.snackBar.open('Error al registrar el alumno', 'Cerrar', { duration: 3000 });
  //       }
  //     });
  //   } else {
  //     this.snackBar.open('Por favor complete todos los campos correctamente', 'Cerrar', { duration: 3000 });
  //   }
  // }
  
  
  

  errorEmail() {
    if (this.email.hasError('required')) {
      return 'Debes ingresar un email';
    }
    return this.email.hasError('email') ? 'Email no valido' : '';
  }

  errorPassword() {
    return this.password.hasError('required') ? 'Debes ingresar una contraseña' : '';
  }

  errorName() {
    return this.name.hasError('required') ? 'Debes ingresar un nombre' : '';
  }

  errorApellidoP() {
    return this.paterno.hasError('required') ? 'Debes ingresar un apellido paterno' : '';
  }

  errorApellidoM() {
    return this.materno.hasError('required') ? 'Debes ingresar un apellido materno' : '';
  }

  errorNumeroControl() {
    return this.control.hasError('required') ? 'Debes ingresar un numero de control' : '';
  }

  confirmarAccion(mensaje: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: mensaje }
    });

    return dialogRef.afterClosed().toPromise();
  }
  
  async register(): Promise<void> {
    const confirmado = await this.confirmarAccion('¿Seguro que deseas registar este alumno?');
    console.log("Resgistrar");
    if (this.control.valid && this.name.valid && this.paterno.valid && this.materno.valid && this.email.valid && this.password.valid) {
  
      console.log('Datos enviados:', this.alumno);
  
      this.http.post('http://127.0.0.1:8000/api/alumnos', this.alumno).subscribe({
        next: (response: any) => {
          console.log('Respuesta del API:', response);
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
          this.toggleMode();
        },
        error: (err) => {
          console.error('Error al registrar el alumno:', err);
          if (err.error) {
            console.error('Detalles del error:', err.error);
          }
          this.snackBar.open('Error al registrar el alumno', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Por favor complete todos los campos correctamente', 'Cerrar', { duration: 3000 });
    }
  }
}
