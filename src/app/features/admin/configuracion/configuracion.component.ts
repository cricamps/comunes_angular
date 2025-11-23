import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

interface Configuracion {
  montoMensual: number;
  diaVencimiento: number;
  diaEmision: number;
}

interface ConfigGeneral {
  nombreComunidad: string;
  direccion: string;
  emailContacto: string;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {
  tabActivo: string = 'gastos';
  
  config: Configuracion = {
    montoMensual: 50000,
    diaVencimiento: 15,
    diaEmision: 1
  };
  
  configGeneral: ConfigGeneral = {
    nombreComunidad: 'Pasajes 8651 y 8707',
    direccion: '',
    emailContacto: ''
  };
  
  propietarios: any[] = [];
  
  estadisticasProp = {
    total: 0,
    ocupadas: 0,
    disponibles: 13
  };

  ngOnInit(): void {
    this.cargarConfig();
    this.cargarPropietarios();
  }

  cambiarTab(tab: string): void {
    this.tabActivo = tab;
  }

  cargarConfig(): void {
    const configGuardada = localStorage.getItem('configuracion');
    if (configGuardada) {
      this.config = JSON.parse(configGuardada);
    }
    
    const configGeneralGuardada = localStorage.getItem('configuracionGeneral');
    if (configGeneralGuardada) {
      this.configGeneral = JSON.parse(configGeneralGuardada);
    }
  }

  cargarPropietarios(): void {
    const usuarios = this.obtenerUsuarios();
    this.propietarios = usuarios.filter(u => u.casa && u.pasaje);
    
    // Calcular estadísticas
    this.estadisticasProp.total = this.propietarios.length;
    
    const casasUnicas = new Set(this.propietarios.map(p => `${p.pasaje}-${p.casa}`));
    this.estadisticasProp.ocupadas = casasUnicas.size;
    this.estadisticasProp.disponibles = 13 - this.estadisticasProp.ocupadas;
  }

  guardarConfigGastos(): void {
    localStorage.setItem('configuracion', JSON.stringify(this.config));
    alert('✅ Configuración de gastos guardada correctamente');
  }

  guardarConfigGeneral(): void {
    localStorage.setItem('configuracionGeneral', JSON.stringify(this.configGeneral));
    alert('✅ Configuración general guardada correctamente');
  }

  obtenerUsuarios(): any[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }
}
