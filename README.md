# 🎓 Orientador Vocacional Venezuela

Una aplicación web diseñada especialmente para estudiantes de 5to año de bachillerato en Venezuela. Permite realizar un test vocacional interactivo para descubrir la mejor área de estudio y recomienda carreras y universidades en el país de forma dinámica.

## ✨ Características Principales
- **Test interactivo y dinámico** con evaluación de inclinaciones.
- **Sistema de recomendación** basado en puntajes en 6 grandes áreas de conocimiento.
- **Estética premium y minimalista (Glassmorphism)**, adaptada a públicos jóvenes, súper responsiva sin usar frameworks de CSS complejos, ideal para estudiar diseño frontend puro (CSS Variables, Flexbox, micro-animaciones UI).
- **Backend robusto pero ligero** desarrollado enteramente en Node.js y Express.
- **Base de datos zero-config** usando SQLite3. ¡No necesitas instalar motores de bases de datos! La información se alojará localmente en \`src/db/vocacional.db\`.
- **Panel Administrativo CRUD** para gestionar de manera fácil la oferta académica (carreras y universidades).

## 📁 Estructura del Proyecto

\`\`\`
orientador-vocacional/
├── package.json         # Dependencias del proyecto (express, sqlite3, cors)
├── server.js            # Servidor Express.js (Punto de entrada backend del sistema)
├── src/
│   ├── db/
│   │   ├── database.js  # Configuración y esquemas de tablas SQLite
│   │   └── seed.js      # Script automatizado para inyectar universidades venezolanas
│   └── routes/
│       └── api.js       # Rutas API REST y algoritmia del test vocacional
└── public/              # Frontend (Single Page Application estructurada dinámicamente)
    ├── index.html       # Estructura principal
    ├── css/
    │   └── style.css    # Diseño premium CSS de primer nivel (Natívo)
    └── js/
        ├── app.js       # Enrutador Javascript
        ├── api.js       # Manejador de peticiones asíncronas
        └── views/       # Vistas inyectables
            ├── home.js
            ├── test.js
            ├── results.js
            ├── universities.js
            └── admin.js
\`\`\`

## 🚀 Instalación y Ejecución Local

Sigue estos 3 simples pasos para ejecutar el sistema en tu entorno de desarrollo o local:

**1. Instalar las dependencias de Node**
Abre tu terminal en la carpeta principal del proyecto y ejecuta:
\`\`\`bash
npm install
\`\`\`

**2. Poblar la base de datos (Ejecuta sólo la primera vez)**
Este script llenará el sistema con un conjunto de universidades locales (UCV, USB, UCAB, LUZ, etc.) y múltiples carreras populares asociadas a las áreas de vocación:
\`\`\`bash
npm run seed
\`\`\`

**3. Iniciar el servidor web**
Levanta la aplicación ingresando:
\`\`\`bash
npm start
\`\`\`

¡Todo listo! Tu aplicación te indicará que ha cargado con éxito. 
Abre tu navegador web e ingresa a: **[http://localhost:3000](http://localhost:3000)**

## 👩‍💻 Notas para Estudiantes
- **Sin Dependencias de Compilación:** Para evitar herramientas como Webpack, Babel o Vite (que pueden abrumar al iniciar), el Frontend está escrito completamente en Vanilla JavaScript usando ES6 Modules (\`type="module"\` en tu navegador). Así podrás leer cada módulo nativamente.
- **Cero problemas de CORS o Proxies:** Todo el frontend es servido en el mismo dominio (puerto 3000) a través del subidrectorio `/public` configurado en `server.js` con el middleware de Express.
"# test_vocacional" 
