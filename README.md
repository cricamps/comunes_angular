# Sistema de Gastos Comunes - Angular

Sistema web para la gestión de gastos comunes de una comunidad residencial con dos pasajes (8651 y 8707) que suman 13 casas en total.

## 📋 Descripción del Proyecto

Aplicación desarrollada con Angular que permite:
- Gestión de residentes y usuarios
- Administración de gastos comunes
- Control de pagos
- Solicitudes de nuevas cuentas
- Dashboard diferenciado para administradores y residentes

## 🏗️ Estructura de la Comunidad

- **Pasaje 8651**: 6 casas (A-F)
- **Pasaje 8707**: 7 casas (A-G)
- **Total**: 13 casas

## 🚀 Tecnologías Utilizadas

- **Framework**: Angular 19.0.0
- **Estilos**: Bootstrap 5.3.8 + SCSS
- **Lenguaje**: TypeScript 5.6.2
- **Testing**: Jasmine + Karma
- **Iconos**: Bootstrap Icons 1.13.1

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
│       └── auth.service.ts   # Servicio de autenticación
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
│   │   └── configuracion/
│   ├── usuario/              # Panel de usuario
│   │   ├── dashboard/
│   │   ├── mis-gastos/
│   │   ├── historial-pagos/
│   │   └── realizar-pago/
│   └── shared/               # Componentes compartidos
│       ├── perfil/
│       └── detalle-gasto/    # Ejemplo de paso de datos
├── models/                    # Interfaces y modelos
│   ├── usuario.model.ts
│   ├── gasto.model.ts
│   └── pago.model.ts
└── shared/                    # Componentes y utilidades compartidas
    ├── components/
    │   └── navbar/
    └── validators/
        └── custom-validators.ts
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

## 🎨 Directivas Angular Implementadas

### *ngIf - Renderizado Condicional
```html
<div *ngIf="mostrarError">Mensaje de error</div>
<span *ngIf="usuario.rol === 'administrador'">Admin</span>
```

### *ngFor - Iteración sobre colecciones
```html
<tr *ngFor="let residente of residentes">
  <td>{{ residente.nombre }}</td>
</tr>
```

### [(ngModel)] - Two-way Data Binding
```html
<input [(ngModel)]="busqueda" placeholder="Buscar...">
```

## 🔄 Paso de Datos entre Componentes

### Ejemplo: Ver detalle de un gasto

**Componente origen** (gestionar-gastos.component.ts):
```typescript
verDetalleGasto(gasto: any): void {
  const navigationExtras: NavigationExtras = {
    state: { gasto: gasto }
  };
  this.router.navigate(['/detalle-gasto'], navigationExtras);
}
```

**Componente destino** (detalle-gasto.component.ts):
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
ng test

Ejecutar en modo headless:
ng test --watch=false --browsers=ChromeHeadless


## 📝 Validaciones Personalizadas

### RUT Chileno
Formato: 12.345.678-9

### Contraseña Fuerte
- Mínimo 6 caracteres
- Al menos 1 número
- Al menos 1 mayúscula

### Edad Mínima
- Mayores de 18 años para residentes
- Mayores de 13 años para solicitudes

### Teléfono Chileno
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
```

## 👨‍💻 Desarrollo

### Autor
Cristobal Camps

### Curso
DSY2202 - Desarrollo Full Stack II

### Institución
Duoc UC

## 📄 Licencia

Este proyecto es parte de una actividad académica.

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

**Total**: 29 pruebas unitarias

Componentes con tests:
- LoginComponent (10 tests)
- RegistroComponent (10 tests)
- DashboardComponent (9 tests)

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

- **Componentes**: 21
- **Servicios**: 1 (AuthService)
- **Guards**: 1 (AuthGuard)
- **Modelos**: 3 (Usuario, Gasto, Pago)
- **Validadores personalizados**: 9
- **Pruebas unitarias**: 29
- **Directivas usadas**: ngIf (15+), ngFor (15+), ngModel (10+)
- **Formularios reactivos**: 2 (Login, Registro)
- **Validaciones totales**: 21 (18 built-in + 3 custom)

---

**Última actualización**: Noviembre 2025
**Versión**: 2.0.0
**Estado**: Semana 6 - Evaluación Sumativa 2
