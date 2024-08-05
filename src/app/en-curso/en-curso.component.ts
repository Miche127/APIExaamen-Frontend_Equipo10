import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-en-curso',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './en-curso.component.html',
  styleUrl: './en-curso.component.css'
})
export class EnCursoComponent implements OnInit {
  currentActivity: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Cargar la actividad en curso del usuario
    this.http.get('http://127.0.0.1:8000/api/actividad-en-curso').subscribe((data: any) => {
      this.currentActivity = data;
    });
  }
}