# El Canal Lubricentro

Web completa para Lubricentro "El Canal", ubicada en Córdoba, Argentina.
Combina un Frontend puro y ultra-rápido con un Backend moderno y seguro en Node.js, siguiendo buenas prácticas de arquitectura y diseño "Dark Luxury".

## 🚀 Requisitos Previos

- **Node.js**: v18 o superior
- **MongoDB**: Instalado y corriendo localmente (o un cluster en MongoDB Atlas)

## 🛠️ Instalación y Configuración

1. **Clonar repositorio** y/o ubicarse en la carpeta raíz del proyecto.
2. **Instalar dependencias del backend:**
   ```bash
   npm install
   ```
3. **Configurar Variables de Entorno:**
   Creá un archivo `.env` en la raíz copiando el contenido de `.env.example`:
   ```bash
   MONGO_URI=mongodb://localhost:27017/lubricentro
   PORT=5000
   JWT_SECRET=supersecretkey_change_me
   EMAIL_HOST=smtp.office365.com
   EMAIL_PORT=587
   EMAIL_USER=elcanallubricantes@live.com.ar
   EMAIL_PASS=tu_password
   CLIENT_URL=http://localhost:5000
   ```

## 🚗 Iniciar la Aplicación

### Modo Desarrollo
Este modo utiliza `nodemon` para reiniciar el servidor automáticamente ante los cambios en el código backend.
```bash
npm install -g nodemon
npm run dev
```

### Modo Producción
```bash
npm start
```

La aplicación quedará disponible en `http://localhost:5000` (El servidor de Node.js se encarga de servir también los estáticos de la carpeta raíz).

## 🔒 Acceso al Panel de Administración

1. Para ingresar al panel, primero debés registrar un **Administrador** (Esto sólo se puede hacer una vez por seguridad). Podés usar un cliente HTTP (Postman, Thunder Client, Curl):
   ```bash
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json

   {
     "username": "admin",
     "password": "PasswordSegura123"
   }
   ```
2. Una vez creado el usuario, dirígete en tu navegador a `http://localhost:5000/admin.html` e ingresá las credenciales.
3. El panel te permitirá ver los mensajes de contacto de la landing y las cotizaciones de la sección B2B/Empresas.

## 📁 Estructura del Código

- `/`: Entry point del backend `server.js` y configuración de Vercel.
- `/public`: Contiene todos los archivos estáticos servidos al cliente.
  - `index.html`: Landing page principal.
  - `admin.html`: Panel de administración.
  - `/css`: Hojas de estilo Vanilla CSS (`styles.css`, `admin.css`).
  - `/js`: Lógica Frontend Vanilla JS (`main.js`, `contact.js`, `admin.js`).
  - `/img`: Imágenes y logo del proyecto.
- `/routes`: Rutas de la API Express (Autenticación y Formularios).
- `/models`: Schemas de Mongoose para MongoDB.
- `/middleware`: Control de acceso con JWT y validaciones.
- `/utils`: Servicios utilitarios como envío de mails (Nodemailer).

## 🛡️ Seguridad Implementada (Backend-Master Skill)

- `helmet` para protección de cabeceras HTTP.
- CSP (Content Security Policy) estricto.
- `express-rate-limit` para evitar spams e inyecciones de fuerza bruta en los endpoints.
- Base de datos validada en entrada por Mongoose y en rutas con `express-validator`.
- Contraseñas fuertemente encriptadas en DB usando `bcryptjs`.
- Protección de endpoints de administración por JWT.
