import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private correoPerfil: number= 0;
  private inscrito:number=0;

  setCorreoPerfil(correo: number) {
    this.correoPerfil = correo;
  }

  getCorreoPerfil(): number {
    return this.correoPerfil;
  }

  setInscritoPerfil(inscrito: number) {
    this.inscrito = inscrito;
  }

  getInscritoPerfil(): number {
    return this.inscrito;
  }
  
}