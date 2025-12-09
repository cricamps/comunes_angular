# Sistema de Gastos Comunes - Angular

Sistema web para la gestión de gastos comunes de una comunidad residencial con dos pasajes (8651 y 8707) que suman 13 casas en total.

## 📋 Descripción del Proyecto

Aplicación desarrollada con Angular que permite:
- Gestión de residentes y usuarios
- Administración de gastos comunes
- Control de pagos
- Solicitudes de nuevas cuentas
- Dashboard diferenciado para administradores y residentes
- **🆕 Consumo de datos desde archivos JSON**
- **🆕 Estadísticas y análisis de gastos**

## 🏗️ Estructura de la Comunidad

- **Pasaje 8651**: 6 casas (numeradas 8651-1 a 8651-6)
- **Pasaje 8707**: 7 casas (numeradas 8707-1 a 8707-7)
- **Total**: 13 casas

## 🚀 Tecnologías Utilizadas

- **Framework**: Angular 19.0.0
- **Estilos**: Bootstrap 5.3.8 + SCSS
- **Lenguaje**: TypeScript 5.6.2
- **Testing**: Jasmine + Karma
- **Iconos**: Bootstrap Icons 1.13.1
- **HTTP Client**: Para consumo de APIs JSON

## 📦 Instalación

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm (viene con Node.js)
- Angular CLI

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone [URL-del-repositorio]
cd comunes-angular
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar el proyecto:
```bash
ng serve
```

4. Abrir en el navegador:
```
http://localhost:4200
```

## 👥 Credenciales de Prueba

### Administrador
- **Email**: admin@comunes.cl
- **Contraseña**: Admin123!

### Residentes
- **Email**: usuario@comunes.cl
- **Contraseña**: User123!

- **Email**: maria@comunes.cl
- **Contraseña**: Maria123!

- **Email**: pedro@comunes.cl
- **Contraseña**: Pedro123!

## 📁 Estructura del Proyecto

```
src/app/
├── core/                      # Servicios y guards centrales
│   ├── guards/
│   │   └── auth.guard.ts     # Protección de rutas
│   └── services/
│       ├── auth.service.ts           # Autenticación
│       ├── casas.service.ts          # 🆕 Consumo de casas.json
│       ├── conceptos-gastos.service.ts # 🆕 Consumo de conceptos-gastos.json
│       └── pagos-historicos.service.ts # 🆕 Consumo de pagos-historicos.json
├── data/                      # Datos mock
│   ├── usuarios-mock.ts
│   ├── gastos-mock.ts
│   └── pagos-mock.ts
├── features/                  # Módulos por funcionalidad
│   ├── auth/                 # Autenticación
│   │   ├── login/
│   │   ├── registro/
│   │   └── recuperar/
│   ├── admin/                # Panel de administración
│   │   ├── dashboard/
│   │   ├── gestionar-gastos/
│   │   ├── gestionar-residentes/
│   │   ├── registrar-pagos/
│   │   ├── solicitudes/
│   │   ├── reportes/
│   │   ├── configuracion/
│   │   ├── lista-casas/               # Consume casas.json
│   │   └── estadisticas-gastos/       # 🆕 Consume todos los JSON
│   ├── usuario/              # Panel de usuario
│   │   ├── dashboard/
│   │   ├── mis-gastos/
│   │   ├── historial-pagos/
│   │   └── realizar-pago/
│   └── shared/               # Componentes compartidos
│       ├── perfil/
│       └── detalle-gasto/
├── models/                    # Interfaces y modelos
│   ├── usuario.model.ts
│   ├── gasto.model.ts
│   ├── pago.model.ts
│   ├── casa.interface.ts              # 🆕 Interface para casas
│   ├── concepto-gasto.interface.ts    # 🆕 Interface para conceptos
│   └── pago-historico.interface.ts    # 🆕 Interface para pagos
└── shared/                    # Componentes y utilidades compartidas
    ├── components/
    │   └── navbar/
    └── validators/
        └── custom-validators.ts

public/data/                   # 🆕 Archivos JSON
├── casas.json                # Datos de las 13 casas
├── conceptos-gastos.json     # Conceptos de gastos comunes
└── pagos-historicos.json     # Historial de pagos
```

## ✨ Funcionalidades Principales

### Para Administradores
- ✅ Dashboard con estadísticas generales
- ✅ Gestión completa de residentes
- ✅ Administración de gastos comunes
- ✅ Registro de pagos
- ✅ Gestión de solicitudes de nuevas cuentas
- ✅ Generación de reportes
- ✅ Configuración del sistema
- ✅ **🆕 Lista de casas (consumiendo JSON)**
- ✅ **🆕 Estadísticas avanzadas de gastos (consumiendo JSON)**

### Para Residentes
- ✅ Dashboard personalizado
- ✅ Visualización de gastos comunes
- ✅ Historial de pagos
- ✅ Realización de pagos
- ✅ Gestión de perfil

### Características Técnicas
- ✅ Autenticación con roles (admin/residente)
- ✅ Guards para protección de rutas
- ✅ Formularios reactivos con validaciones
- ✅ Validadores personalizados (RUT chileno, edad, contraseña)
- ✅ Responsive design con Bootstrap
- ✅ Directivas Angular (ngIf, ngFor, ngModel)
- ✅ Navegación entre componentes con paso de datos
- ✅ LocalStorage y SessionStorage para persistencia
- ✅ **🆕 Consumo de APIs JSON con HttpClient**
- ✅ **🆕 Manejo de Observables con RxJS**
- ✅ **🆕 forkJoin para peticiones en paralelo**

## 🆕 Semana 7: Integración de APIs JSON

### Archivos JSON Creados

#### 1. casas.json
Contiene información de las 13 casas:
- ID único
- Número de casa
- Pasaje
- Dirección
- Información del residente
- Metros cuadrados
- Cantidad de habitantes
- Estado activo/inactivo

#### 2. conceptos-gastos.json
Contiene los conceptos de gastos:
- ID único
- Nombre del concepto
- Descripción
- Tipo de cálculo
- Monto por defecto
- Estado activo
- Categoría

#### 3. pagos-historicos.json
Contiene el historial de pagos:
- ID único
- Información de la casa
- Periodo (mes/año)
- Fecha de pago
- Monto total
- Método de pago
- Estado del pago
- Detalle de gastos

### Servicios Implementados

#### CasasService
Métodos disponibles:
- `getCasas()`: Obtiene todas las casas
- `getCasaById(id)`: Obtiene una casa específica
- `getCasasByPasaje(pasaje)`: Filtra casas por pasaje
- `getCasasActivas()`: Obtiene casas activas
- `getTotalMetrosCuadrados()`: Calcula total de m²
- `getTotalHabitantes()`: Calcula total de habitantes

#### ConceptosGastosService
Métodos disponibles:
- `getConceptosGastos()`: Obtiene todos los conceptos
- `getConceptoById(id)`: Obtiene un concepto específico
- `getConceptosActivos()`: Filtra conceptos activos
- `getConceptosByCategoria(categoria)`: Filtra por categoría
- `calcularTotalMensual()`: Calcula el total mensual
- `getCategorias()`: Obtiene categorías únicas

#### PagosHistoricosService
Métodos disponibles:
- `getPagosHistoricos()`: Obtiene todos los pagos
- `getPagoById(id)`: Obtiene un pago específico
- `getPagosByCasaId(casaId)`: Filtra pagos por casa
- `getPagosByEstado(estado)`: Filtra por estado
- `getPagosByPeriodo(mes, anio)`: Filtra por periodo
- `getTotalRecaudadoPeriodo(mes, anio)`: Calcula recaudación
- `getPagosPendientes()`: Obtiene pagos pendientes
- `getTotalDeudaPendiente()`: Calcula deuda total
- `getEstadisticasCasa(casaId)`: Estadísticas por casa

### Nuevo Componente: EstadisticasGastosComponent

Componente que consume datos de los 3 servicios JSON y muestra:

1. **Tarjetas de resumen**:
   - Gasto mensual por casa
   - Total recaudado
   - Total pendiente
   - Promedio por habitante

2. **Distribución por categorías**:
   - Gráficos de barras con porcentajes
   - Valores en pesos chilenos
   - Colores diferenciados

3. **Lista de conceptos activos**:
   - Conceptos de gasto activos
   - Agrupados por categoría
   - Montos individuales

4. **Estado de pagos**:
   - Total de pagos
   - Pagos completados
   - Pagos pendientes
   - Barra de progreso visual

## 🎨 Directivas Angular Implementadas

### *ngIf - Renderizado Condicional
```html
<div *ngIf="mostrarError">Mensaje de error</div>
<span *ngIf="usuario.rol === 'administrador'">Admin</span>
<div *ngIf="cargando" class="spinner-border"></div>
```

### *ngFor - Iteración sobre colecciones
```html
<tr *ngFor="let residente of residentes">
  <td>{{ residente.nombre }}</td>
</tr>

<div *ngFor="let casa of casas">
  <h5>{{ casa.numeroCasa }}</h5>
</div>
```

### [(ngModel)] - Two-way Data Binding
```html
<input [(ngModel)]="busqueda" placeholder="Buscar...">
<input [(ngModel)]="filtro.mes" type="text">
```

## 🔄 Paso de Datos entre Componentes

### Ejemplo: Ver detalle de un gasto

**Componente origen**:
```typescript
verDetalleGasto(gasto: any): void {
  const navigationExtras: NavigationExtras = {
    state: { gasto: gasto }
  };
  this.router.navigate(['/detalle-gasto'], navigationExtras);
}
```

**Componente destino**:
```typescript
constructor(private router: Router) {
  const navigation = this.router.getCurrentNavigation();
  if (navigation?.extras.state) {
    this.gasto = navigation.extras.state['gasto'];
  }
}
```

## 🧪 Testing

Ejecutar pruebas unitarias:
```bash
ng test
```

Ejecutar en modo headless:
```bash
ng test --watch=false --browsers=ChromeHeadless
```

## 📝 Validaciones Personalizadas

### RUT
Formato: 12.345.678-9

### Contraseña Fuerte
- Mínimo 6 caracteres
- Al menos 1 número
- Al menos 1 mayúscula

### Edad Mínima
- Mayores de 18 años para residentes
- Mayores de 13 años para solicitudes

### Teléfono
- 9 dígitos exactos
- Formato: +56 9 1234 5678

## 🚀 Comandos Útiles

```bash
# Desarrollo
ng serve                    # Ejecutar en desarrollo
ng build                    # Compilar para producción
ng test                     # Ejecutar tests

# Instalación de dependencias
npm install                 # Instalar todas las dependencias
npm install bootstrap       # Instalar Bootstrap

# Documentación
npm run compodoc           # Generar documentación
npm run compodoc:serve     # Generar y servir documentación
```

## 👨‍💻 Desarrollo

### Autor
Cristobal Camps

### Curso
DSY2202 - Desarrollo Full Stack II

### Institución
Duoc UC

---

## 🔬 Pruebas Unitarias

### Ejecutar pruebas
```bash
ng test
```

### Cobertura de pruebas
```bash
ng test --code-coverage
```

### Pruebas implementadas

**Total**: 31 pruebas unitarias (✅ PASANDO)

Componentes con tests:
- LoginComponent (10 tests)
- RegistroComponent (10 tests)
- DashboardComponent (9 tests)
- ListaCasasComponent (2 tests)

---

## 📚 Generar Documentación

### Instalar Compodoc
```bash
npm install --save-dev @compodoc/compodoc
```

### Generar y visualizar documentación
```bash
npm run compodoc:serve
```

La documentación se abrirá automáticamente en `http://localhost:8080`

### Solo generar documentación
```bash
npm run compodoc
```

La documentación se generará en la carpeta `documentation/`

---

## 📊 Estadísticas del Proyecto

- **Componentes**: 22 (🆕 +1 EstadisticasGastosComponent)
- **Servicios**: 5 (Auth + 3 servicios JSON + Carrito)
- **Guards**: 1 (AuthGuard)
- **Modelos**: 6 (Usuario, Gasto, Pago + 3 interfaces JSON)
- **Archivos JSON**: 3 (Casas, Conceptos, Pagos)
- **Validadores personalizados**: 9
- **Pruebas unitarias**: 31 ✅
- **Directivas usadas**: ngIf (20+), ngFor (20+), ngModel (15+)
- **Formularios reactivos**: 2 (Login, Registro)
- **Validaciones totales**: 21


---

**Última actualización**: Diciembre 2025
**Versión**: 3.0.0 - Semana 7
**Estado**: Semana 7 - Integración de APIs JSON Completada ✅
