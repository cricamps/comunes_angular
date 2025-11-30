import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Usuario } from '../../models/usuario.model';

describe('AuthService - Validación de correos duplicados', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    
    // Limpiar localStorage y sessionStorage antes de cada test
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    // Limpiar después de cada test
    localStorage.clear();
    sessionStorage.clear();
  });

  it('debe permitir registrar un usuario nuevo con correo único', () => {
    // Arrange - Preparar
    const nuevoUsuario: Usuario = {
      email: 'nuevo@test.cl',
      password: 'Test123!',
      nombre: 'Usuario Nuevo',
      rut: '11111111-1',
      telefono: '987654321',
      pasaje: '8651',
      casa: 'D',
      rol: 'residente',
      tipo: 'residente',
      fechaRegistro: new Date()
    };

    // Act - Ejecutar
    const resultado = service.addUser(nuevoUsuario);

    // Assert - Verificar
    expect(resultado).toBe(true);
    
    // Verificar que el usuario se guardó en localStorage
    const usuariosStorage = localStorage.getItem('usuarios');
    expect(usuariosStorage).toBeTruthy();
    
    if (usuariosStorage) {
      const usuarios = JSON.parse(usuariosStorage);
      const usuarioGuardado = usuarios.find((u: Usuario) => u.email === 'nuevo@test.cl');
      expect(usuarioGuardado).toBeTruthy();
      expect(usuarioGuardado?.nombre).toBe('Usuario Nuevo');
    }
  });

  it('NO debe permitir registrar un correo que ya existe', () => {
    // Arrange - Preparar
    // Primero, crear un usuario inicial
    const usuarioInicial: Usuario = {
      email: 'existente@test.cl',
      password: 'Test123!',
      nombre: 'Usuario Existente',
      rut: '22222222-2',
      telefono: '987654321',
      pasaje: '8651',
      casa: 'E',
      rol: 'residente',
      tipo: 'residente',
      fechaRegistro: new Date()
    };
    
    // Registrar el primer usuario
    const registroInicial = service.addUser(usuarioInicial);
    expect(registroInicial).toBe(true);
    
    // Act - Ejecutar
    // Intentar registrar el mismo correo con datos diferentes
    const usuarioDuplicado: Usuario = {
      email: 'existente@test.cl', // ¡Mismo correo!
      password: 'OtraPassword123!',
      nombre: 'Otro Nombre',
      rut: '33333333-3',
      telefono: '912345678',
      pasaje: '8707',
      casa: 'A',
      rol: 'residente',
      tipo: 'residente',
      fechaRegistro: new Date()
    };
    
    const resultado = service.addUser(usuarioDuplicado);

    // Assert - Verificar
    expect(resultado).toBe(false);
    
    // Verificar que NO se creó un segundo usuario
    const usuariosStorage = localStorage.getItem('usuarios');
    if (usuariosStorage) {
      const usuarios = JSON.parse(usuariosStorage);
      const usuariosConEseEmail = usuarios.filter((u: Usuario) => u.email === 'existente@test.cl');
      
      // Solo debe haber 1 usuario con ese email
      expect(usuariosConEseEmail.length).toBe(1);
      
      // Y debe tener los datos originales, no los del duplicado
      expect(usuariosConEseEmail[0].nombre).toBe('Usuario Existente');
      expect(usuariosConEseEmail[0].nombre).not.toBe('Otro Nombre');
    }
  });

  it('NO debe permitir registrar correo admin@comunes.cl (ya existe en mock)', () => {
    // Arrange - Preparar
    const usuarioConEmailAdmin: Usuario = {
      email: 'admin@comunes.cl', // Este correo ya existe en USUARIOS_MOCK
      password: 'NuevaPassword123!',
      nombre: 'Intento de Admin Falso',
      rut: '44444444-4',
      telefono: '923456789',
      pasaje: '8651',
      casa: 'F',
      rol: 'residente',
      tipo: 'residente',
      fechaRegistro: new Date()
    };

    // Act - Ejecutar
    const resultado = service.addUser(usuarioConEmailAdmin);

    // Assert - Verificar
    expect(resultado).toBe(false);
  });

  it('debe permitir registrar múltiples usuarios con correos diferentes', () => {
    // Arrange - Preparar
    const usuario1: Usuario = {
      email: 'usuario1@test.cl',
      password: 'Test123!',
      nombre: 'Usuario 1',
      rut: '55555555-5',
      telefono: '987654321',
      pasaje: '8651',
      casa: 'A',
      rol: 'residente',
      tipo: 'residente',
      fechaRegistro: new Date()
    };

    const usuario2: Usuario = {
      email: 'usuario2@test.cl',
      password: 'Test123!',
      nombre: 'Usuario 2',
      rut: '66666666-6',
      telefono: '912345678',
      pasaje: '8707',
      casa: 'B',
      rol: 'residente',
      tipo: 'residente',
      fechaRegistro: new Date()
    };

    // Act - Ejecutar
    const resultado1 = service.addUser(usuario1);
    const resultado2 = service.addUser(usuario2);

    // Assert - Verificar
    expect(resultado1).toBe(true);
    expect(resultado2).toBe(true);

    // Verificar que ambos están en localStorage
    const usuariosStorage = localStorage.getItem('usuarios');
    if (usuariosStorage) {
      const usuarios = JSON.parse(usuariosStorage);
      expect(usuarios.length).toBeGreaterThanOrEqual(2);
      
      const emails = usuarios.map((u: Usuario) => u.email);
      expect(emails).toContain('usuario1@test.cl');
      expect(emails).toContain('usuario2@test.cl');
    }
  });
});
