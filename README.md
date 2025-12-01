# Mueblería Hermanos Jota — E-commerce

Este repositorio contiene una aplicación de e-commerce (frontend en React + backend en Express) creada como entrega para el proyecto "Mueblería Hermanos Jota".

El objetivo es una aplicación cliente-servidor completa que permite listar, crear, editar y eliminar productos, conectada a una base de datos de MongoDB Atlas mediante Mongoose.

## 🚀 Enlaces de Despliegue

Frontend (Vercel/Netlify): https://e-commerce-muebleria-hnos-jota.vercel.app/

Backend (Render): https://muebleria-backend.onrender.com

---

## Tabla de contenido
- [Estructura del repositorio](#estructura-del-repositorio)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
  - [Backend (Express)](#backend-express)
  - [Frontend (Vite + React)](#frontend-vite--react)
- [API (endpoints)](#api-endpoints)
- [Créditos](#créditos)

---

## Estructura del repositorio

Raíz (extracto):

```
/README.md
/backend/
  package.json
  index.js
  .env.example
  seeder.js
  /routes/productos.js
  /models/producto_model.js
  /data/
    productos.json
    db.js
/client/
  package.json
  /src/
    /components/
    /context/
    /pages/
    /styles/
    App.jsx
    main.jsx
```

---

## Requisitos previos
- Node.js >= 16.x
- npm (v8+)
- Una cuenta de MongoDB Atlas (para obtener la cadena de conexión)

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
3. Configurar Variables de Entorno (.env)
Crea un archivo llamado .env dentro de la carpeta backend/. Copia el siguiente contenido y reemplaza los valores con tu información de MongoDB Atlas.

```powershell
# Puerto en el que correrá el servidor
PORT=4000

# Cadena de conexión de MongoDB Atlas
# Asegúrate de reemplazar <usuario>, <password> y <cluster_url>
# y de incluir el nombre de tu base de datos (ej: muebleriajhnos)
DB_URL="mongodb+srv://<usuario>:<password>@<cluster_url>/muebleriajhnos?retryWrites=true&w=majority"
```
4. Poblar la Base de Datos (Seeding)
Este comando borrará los datos existentes e insertará los 11 productos del archivo productos.json en tu base de datos de Atlas.

```powershell
node seeder.js
```
(Deberías ver un mensaje de éxito: 🎉 11 productos importados correctamente...)

5. Levantar el servidor en modo desarrollo (con nodemon):
```powershell
npm run dev
```
6. El servidor por defecto escucha en `http://localhost:4000`.

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

## API (endpoints)
La API conectada a MongoDB expone los siguientes endpoints:

- GET /api/productos
  - Devuelve un array con todos los productos de la colección.
- GET /api/productos/:id
  - Devuelve un único producto por su _id.
  - 404 Not Found si no existe.
- POST /api/productos
  - Recibe un objeto JSON en el body para crear un nuevo producto.
  - Devuelve el producto creado con estado 201.
- PUT /api/productos/:id 
  - Recibe un objeto JSON en el body con los campos a actualizar.
  - Devuelve el producto actualizado.
- DELETE /api/productos/:id
  - Elimina un producto por su _id.
  - Devuelve un msj de confirmación.
- POST /api/productos/:id/reviews
  - Crea una nueva reseña
- GET /api/productos/:id/reviews
  - Obtener reseñas de un producto
- POST /api/usuarios/registro
  - Registra un nuevo usuario
- POST /api/usuarios/logins
  - Loguea un usuario
- GET /api/orders/mis-pedidos
  - Obtener las órdenes del usuario logueado
  - Privado
---

## Credenciales

Para iniciar sesión como admin y poder crear productos desde el endpoint `/admin/crear-producto`, debe ingresar estas credenciales.

Correo electrónico: admin@hermanosjota.com

Contraseña: admin123

---

## Créditos
Proyecto creado por el Grupo 4.

- Salto Jorge Ignacio

---
