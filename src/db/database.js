const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'vocacional.db');

// Conexión a SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos', err.message);
    } else {
        console.log('📦 Conectado a la base de datos SQLite.');
    }
});

// Inicialización de la base de datos
const initDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Tabla de áreas de conocimiento
            db.run(`CREATE TABLE IF NOT EXISTS areas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT
            )`);

            // Tabla de carreras
            db.run(`CREATE TABLE IF NOT EXISTS careers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                labor_field TEXT,
                duration TEXT,
                area_id INTEGER,
                FOREIGN KEY(area_id) REFERENCES areas(id)
            )`);

            // Tabla de universidades
            db.run(`CREATE TABLE IF NOT EXISTS universities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT, -- Pública, Privada
                location TEXT
            )`);

            // Tabla intermedia carreras - universidades (relación n a n)
            db.run(`CREATE TABLE IF NOT EXISTS career_university (
                career_id INTEGER,
                university_id INTEGER,
                PRIMARY KEY (career_id, university_id),
                FOREIGN KEY(career_id) REFERENCES careers(id),
                FOREIGN KEY(university_id) REFERENCES universities(id)
            )`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

// Utilidades para ejecutar consultas asíncronas
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this); // Retorna this que incluye lastID y changes
        });
    });
};

module.exports = {
    db,
    initDatabase,
    query,
    run
};
