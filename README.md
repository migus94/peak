# Peak Project

<div align="center">
  <img src="Front/src/assets/images/ESCUDO_CHICO.jpg" alt="Escudo IES Virgen del Carmen" width="700"/>
</div>

## Miguel Fuentes Arribas  
**Proyecto Integrado - 2ºDAM (2024/2025)**  

---

## Índice

1. [Introducción](#1-introducción-1-página)  
2. [Especificación de Requisitos](#2-especificación-de-requisitos)  
3. [Diseño (Diagramas)](#3-diseño-diagramas)  
4. [Implementación (GIT)](#4-implementación-git)  
5. [Resultado (Manual de usuario)](#5-resultado-manual-de-usuario)  
6. [Conclusiones](#6-conclusiones)  

---

## 1. Introducción (1 página)

### Resumen del proyecto

Peak Project es una tienda web para la compra de material para realizar deportes de invierno desarrollada como proyecto final del ciclo 2º de Desarrollo de Aplicaciones Multiplataforma. 

### Aplicación

La aplicación permite a los usuarios registrarse, navegar por los productos, añadir al carrito y a los administradores gestionar contenido de manera versatil.
El sistema incluye: visualizacion para usuarios no registrados, funcionalidades completas para usuarios normales (navegación, compra, comentarios, perfil) y administradores (gestión de productos y usuarios), con control de acceso mediante autenticación JWT.

### Resumen de tecnologías utilizadas

- **Frontend**: Angular 18, PrimeNG 18
- **Backend**: Node.js, Express, MongoDB
- **Base de datos**: MongoDB Atlas
- **Autenticación**: JWT
- **Herramientas**: Swagger

---

## 2. Especificación de Requisitos

### Requisitos funcionales

- Registro e inicio de sesión
- Visualización de lista y detalle de productos
- Gestión de carrito
- Gestión de usuarios y productos (admin)
- Comentarios en productos (registrados)
- Perfil con cambio de contraseña

### Requisitos no funcionales

- Navegación protegida por roles
- Persistencia de sesión vía localStorage
- Documentación de endpoints en Swagger

---

## 3. Diseño (Diagramas)

- **Casos de uso**: 

<img src="Front/src/assets/images/DiagramaUso.png" alt="caso de uso" width="700"/>
  
- **Diagrama entidad-relación (BBDD no relacional)**:
  Base de datos MongoDB, en la que no se utilizan claves foráneas estrictas. Las relaciones se mantienen mediante identificadores (`publicId`), ofreciendo una estructura simple adaptada a nuestra arquitectura REST
  

- **Diagrama de clases (modelo)**:
  <img src="Front/src/assets/images/UML.png" alt="UML" width="700"/>

---

## 4. Implementación (GIT)

### Diagrama de arquitectura

- Angular consume API REST en Express
- Comunicación protegida con tokens
- Base de datos MongoDB para persistencia

### Tecnologías

- Angular + PrimeNG
- Node.js + Express
- Mongoose (ODM)
- Swagger UI

### Código (Partes interesantes)

- `auth.interceptor.ts`: inyecta token automáticamente
- `CartService`: gestión reactiva con signals
- `adminGuard.ts`: protege rutas según rol
- `ProductDetailComponent`: actualiza stock tras añadir
- `p-dialog`: implementación de formularios en pop-up

### Organización del proyecto

- **Patrón**: Separación por módulos y servicios (best practices Angular)
- Estructura clara para componentes, rutas y servicios
- Uso de `@for`, `@if`, `signals`, `computed`

---

## 5. Resultado (Manual de usuario)

### Acciones disponibles

- **Usuario no registrado**: puede registrarse, iniciar sesión y ver productos
- **Usuario logueado**: puede comentar, añadir al carrito y cambiar contraseña
- **Administrador**: puede eliminar usuarios y productos
- Menús laterales dinámicos según rol

---

## 6. Conclusiones

### Dificultades

- Manejo reactivo de estados en Angular
- Actualización del stock sin recargar vistas
- Control de roles y tokens en frontend

### Mejoras

- Añadir pasarela de pago real
- Panel más completo de administración
- Gestión de imágenes en cloud
- Emails y recuperación de cuenta
