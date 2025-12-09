import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CasasService } from '../../../core/services/casas.service';
import { TasasInteresService } from '../../../core/services/tasas-interes.service';
import { TipoCambioService } from '../../../core/services/tipo-cambio.service';
import { TasaInteres } from '../../../models/tasa-interes.interface';

/**
 * Componente que demuestra las 3 formas de consumir datos:
 * 1. JSON Local (public/data/)
 * 2. JSON Externo (GitHub Pages)
 * 3. API Real (exchangerate-api.com)
 */
@Component({
  selector: 'app-info-financiera',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './info-financiera.component.html',
  styleUrls: ['./info-financiera.component.scss']
})
export class InfoFinancieraComponent implements OnInit {
  cargando = true;
  
  // FORMA 1: JSON Local
  totalCasas = 0;
  errorLocal = '';

  // FORMA 2: JSON Externo (GitHub Pages)
  tasasInteres: TasaInteres[] = [];
  tasaMasBaja?: TasaInteres;
  errorTasas = '';

  // FORMA 3: API Real Externa
  dolarHoy = 0;
  euroHoy = 0;
  fechaActualizacion = '';
  errorTipoCambio = '';

  constructor(
    private casasService: CasasService,
    private tasasService: TasasInteresService,
    private tipoCambioService: TipoCambioService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // FORMA 1: JSON Local
    this.casasService.getCasas().subscribe({
      next: (casas) => {
        this.totalCasas = casas.length;
        console.log('✅ FORMA 1 (JSON Local): Cargadas', casas.length, 'casas');
      },
      error: () => {
        this.errorLocal = 'Error al cargar JSON local';
      }
    });

    // FORMA 2: JSON Externo GitHub Pages
    this.tasasService.getTasasVigentes().subscribe({
      next: (tasas) => {
        this.tasasInteres = tasas;
        if (tasas.length > 0) {
          this.tasaMasBaja = tasas.reduce((min, tasa) =>
            tasa.tasaAnual < min.tasaAnual ? tasa : min
          );
        }
        console.log('✅ FORMA 2 (GitHub Pages): Cargadas', tasas.length, 'tasas');
      },
      error: () => {
        this.errorTasas = 'Configura tu URL de GitHub Pages en tasas-interes.service.ts';
        console.warn('⚠️ FORMA 2: No configurada o sin acceso');
      }
    });

    // FORMA 3: API Real Externa
    this.tipoCambioService.getResumenMonedas().subscribe({
      next: (monedas) => {
        const dolar = monedas.find(t => t.moneda === 'USD');
        const euro = monedas.find(t => t.moneda === 'EUR');
        
        if (dolar) {
          this.dolarHoy = dolar.valor;
          this.fechaActualizacion = dolar.fecha;
        }
        if (euro) {
          this.euroHoy = euro.valor;
        }
        console.log('✅ FORMA 3 (API Real): USD =', this.dolarHoy, 'CLP');
      },
      error: () => {
        this.errorTipoCambio = 'No se pudo conectar con la API externa';
        console.error('❌ FORMA 3: Error de conexión');
      }
    });

    this.cargando = false;
  }
}
