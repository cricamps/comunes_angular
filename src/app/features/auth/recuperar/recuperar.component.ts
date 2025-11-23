import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.scss']
})
export class RecuperarComponent {
  email: string = '';
  enviando: boolean = false;
  mostrarExito: boolean = false;
  mostrarError: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  enviarRecuperacion(): void {
    if (!this.email) {
      return;
    }

    this.enviando = true;
    this.mostrarError = false;
    this.mostrarExito = false;

    // Simular envío
    setTimeout(() => {
      // Verificar si el email existe
      const usuarios = this.obtenerUsuarios();
      const usuario = usuarios.find((u: any) => u.email === this.email);

      if (usuario) {
        this.mostrarExito = true;
        this.mensajeExito = `✅ Se han enviado las instrucciones de recuperación a ${this.email}`;
        this.email = '';
      } else {
        this.mostrarError = true;
        this.mensajeError = '❌ No existe una cuenta con ese correo electrónico';
      }

      this.enviando = false;
    }, 1500);
  }

  obtenerUsuarios(): any[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }
}
