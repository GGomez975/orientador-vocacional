import express from ('express');
import cors from ('cors');
import path from ('path');
import db from ('./src/db/database');
import apiRoutes from('./src/routes/api');

import app from express();
import PORT from process.env.PORT || 3000;

// Configuración de Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api', apiRoutes);

// Ruta predeterminada (sirve el index.html)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar base de datos y luego el servidor
db.initDatabase().then(() => {
    // Solo iniciamos el servidor con app.listen si no estamos en Vercel (evita conflictos en serverless)
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor de Orientador Vocacional corriendo en http://localhost:${PORT}`);
        });
    }
}).catch(err => {
    console.error('❌ Error al inicializar la base de datos:', err);
});

module.exports = app;

