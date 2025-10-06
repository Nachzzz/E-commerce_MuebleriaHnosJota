# Mueblería Hermanos Jota — E-commerce

Este repositorio contiene una aplicación de e-commerce (frontend en React + backend en Express) creada como entrega para el proyecto "Mueblería Hermanos Jota".

El objetivo es una aplicación cliente-servidor mínima que permita listar productos, ver destacados y servir una API REST simple desde un backend Express que utiliza un archivo local como fuente de datos.

---

## Tabla de contenido
- [Demo y objetivo](#demo-y-objetivo)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
  - [Backend (Express)](#backend-express)
  - [Frontend (Vite + React)](#frontend-vite--react)
  - [Flujo recomendado de desarrollo](#flujo-recomendado-de-desarrollo)
- [API (endpoints)](#api-endpoints)
- [Créditos y licencias](#créditos-y-licencias)

---

## Demo y objetivo
Una tienda ficticia que muestra:
- Frontend en React (Vite) con componentes: NavBar, HeroBanner, FeaturedProducts, Products, Footer, etc.
- Backend en Express que expone una API REST con los productos cargados desde un archivo local (`backend/data/productos.js`).

La interfaz consume inicialmente la ruta `/api/productos` (si el backend está activo) y, en caso de no estarlo, usa un fallback estático `client/public/data/productos.json`.

---

## Estructura del repositorio

Raíz (extracto):

```
/README.md
/backend/
  package.json
  index.js
  /routes/productos.js
  /data/productos.js
/client/
  package.json
  /public/
    /data/productos.json
    /assets/...
  /src/
    /components/  (NavBar, HeroBanner, ProductCard...)
    /pages/       (Home.jsx, Products.jsx)
    /styles/      (App.css, Home.css, Products.css...)
```

---

## Requisitos previos
- Node.js >= 16.x
- npm (v8+) o yarn

Se recomienda usar nvm o similar para gestionar versiones de Node.

---

## Instalación y ejecución
A continuación las instrucciones para ejecutar backend y frontend.

### Backend (Express)
1. Abrir terminal en la carpeta `backend`:
```powershell
cd backend
```
2. Instalar dependencias:
```powershell
npm install
```
3. Levantar el servidor en modo desarrollo (con nodemon):
```powershell
npm run dev
```
4. El servidor por defecto escucha en `http://localhost:4000`.

Endpoints disponibles:
- `GET /api/productos` — devuelve array con todos los productos.
- `GET /api/productos/:id` — devuelve producto por `id` (404 si no existe).

> Nota: el servidor incluye un middleware global que imprime en consola cada petición (método y URL), y usa `express.json()`.

### Frontend (Vite + React)
1. Abrir otra terminal en la carpeta `client`:
```powershell
cd client
```
2. Instalar dependencias (si no están instaladas):
```powershell
npm install
```
3. Iniciar el servidor de desarrollo (Vite):
```powershell
npm run dev
```
4. Abrir en el navegador la URL que indique Vite (por ejemplo `http://localhost:5173`).

El frontend intentará llamar a `/api/productos`. Si el backend corre en `localhost:4000` y hay problemas de CORS, hay dos opciones:
- Habilitar CORS en el backend (recomendado si vas a separar puertos).
- Servir el frontend desde el backend (en `backend/index.js` ya se sirve `client/public` estático como opción simple).

---

## Flujo recomendado de desarrollo
1. Ejecuta el backend:
```powershell
cd backend
npm run dev
```
2. Ejecuta el frontend:
```powershell
cd client
npm run dev
```
3. Abre `http://localhost:5173` y prueba:
   - Home
   - Productos: `http://localhost:5173/productos` (o `.../products` según detección en `App.jsx`)

---

## API (endpoints)
- GET /api/productos
  - Respuesta: 200 OK
  - Body: Array de objetos producto
- GET /api/productos/:id
  - Respuesta: 200 OK con el producto si existe
  - 404 Not Found si no existe

Ejemplo de respuesta (parcial):
```json
{
  "id": 1,
  "nombre": "Aparador Uspallata",
  "precio": 185000,
  "imagen": "https://nachzzz.github.io/img_ecommerce/aparadorUspallata.png",
  ...
}
```

---

## Créditos y licencia
Proyecto creado por el Grupo 4.
- Camila Selene Varela
- Suarez Gatica Agustina
- Salto Jorge Ignacio

Licencia: MIT (por defecto)

---
