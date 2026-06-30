const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve(__dirname, 'vocacional.json');

let data = {
    areas: [],
    universities: [],
    careers: [],
    career_university: []
};

// Cargar datos del archivo JSON
function loadData() {
    try {
        if (fs.existsSync(jsonPath)) {
            const fileContent = fs.readFileSync(jsonPath, 'utf8');
            data = JSON.parse(fileContent);
        }
    } catch (err) {
        console.error('❌ Error al cargar vocacional.json:', err);
    }
}

// Guardar datos en el archivo JSON
function saveData() {
    try {
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.warn('⚠️ Advertencia: No se pudo escribir en vocacional.json (posible entorno de solo lectura en Vercel):', err.message);
    }
}

// Inicializar cargando datos
loadData();

const initDatabase = () => {
    // Ya no necesitamos crear tablas físicas de SQLite
    return Promise.resolve();
};

const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        try {
            const normalizedSql = sql.trim().replace(/\s+/g, ' ');

            // 1. SELECT COUNT(*) as count FROM areas
            if (/SELECT COUNT\(\*\) as count FROM areas/i.test(normalizedSql)) {
                return resolve([{ count: data.areas.length }]);
            }

            // 2. SELECT id, name FROM areas
            if (/SELECT id,\s*name FROM areas/i.test(normalizedSql)) {
                return resolve(data.areas.map(a => ({ id: a.id, name: a.name })));
            }

            // 3. SELECT id, name FROM universities
            if (/SELECT id,\s*name FROM universities/i.test(normalizedSql)) {
                return resolve(data.universities.map(u => ({ id: u.id, name: u.name })));
            }

            // 4. SELECT * FROM areas WHERE name LIKE ?
            if (/SELECT \* FROM areas WHERE name LIKE \?/i.test(normalizedSql)) {
                const search = params[0].replace(/%/g, '').toLowerCase();
                const matched = data.areas.filter(a => a.name.toLowerCase().includes(search));
                return resolve(matched);
            }

            // 5. SELECT * FROM areas
            if (/SELECT \* FROM areas/i.test(normalizedSql)) {
                return resolve(data.areas);
            }

            // 6. SELECT * FROM universities
            if (/SELECT \* FROM universities/i.test(normalizedSql)) {
                return resolve(data.universities);
            }

            // 7. SELECT c.*, a.name as area_name FROM careers c JOIN areas a ON c.area_id = a.id ...
            if (/SELECT c\.\*, a\.name as area_name FROM careers c JOIN areas a/i.test(normalizedSql)) {
                let result = data.careers.map(c => {
                    const area = data.areas.find(a => a.id === c.area_id);
                    return { ...c, area_name: area ? area.name : '' };
                });

                // Aplicar filtros de búsqueda
                if (normalizedSql.includes('c.title LIKE ?') && normalizedSql.includes('a.name LIKE ?')) {
                    const searchVal = params[0].replace(/%/g, '').toLowerCase();
                    const areaVal = params[1].replace(/%/g, '').toLowerCase();
                    result = result.filter(c => 
                        c.title.toLowerCase().includes(searchVal) && 
                        c.area_name.toLowerCase().includes(areaVal)
                    );
                } else if (normalizedSql.includes('c.title LIKE ?')) {
                    const searchVal = params[0].replace(/%/g, '').toLowerCase();
                    result = result.filter(c => c.title.toLowerCase().includes(searchVal));
                } else if (normalizedSql.includes('a.name LIKE ?')) {
                    const areaVal = params[0].replace(/%/g, '').toLowerCase();
                    result = result.filter(c => c.area_name.toLowerCase().includes(areaVal));
                }

                return resolve(result);
            }

            // 8. SELECT u.name, u.type, u.location FROM universities u JOIN career_university cu ...
            if (/SELECT u\.name, u\.type, u\.location FROM universities u JOIN career_university cu/i.test(normalizedSql)) {
                const careerId = Number(params[0]);
                const relations = data.career_university.filter(cu => cu.career_id === careerId);
                const result = relations.map(r => {
                    const u = data.universities.find(uni => uni.id === r.university_id);
                    return u ? { name: u.name, type: u.type, location: u.location } : null;
                }).filter(Boolean);
                return resolve(result);
            }

            reject(new Error(`Consulta SQL no soportada por el emulador JSON: ${sql}`));
        } catch (err) {
            reject(err);
        }
    });
};

const run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        try {
            const normalizedSql = sql.trim().replace(/\s+/g, ' ');

            // 1. INSERT INTO careers (title, description, labor_field, duration, area_id) VALUES (?, ?, ?, ?, ?)
            if (/INSERT INTO careers/i.test(normalizedSql)) {
                const newId = data.careers.length > 0 ? Math.max(...data.careers.map(c => c.id)) + 1 : 1;
                const [title, description, labor_field, duration, area_id] = params;
                const newCareer = {
                    id: newId,
                    title,
                    description,
                    labor_field,
                    duration,
                    area_id: Number(area_id)
                };
                data.careers.push(newCareer);
                saveData();
                return resolve({ lastID: newId });
            }

            // 2. INSERT INTO universities (name, type, location) VALUES (?, ?, ?)
            if (/INSERT INTO universities/i.test(normalizedSql)) {
                const newId = data.universities.length > 0 ? Math.max(...data.universities.map(u => u.id)) + 1 : 1;
                const [name, type, location] = params;
                const newUni = {
                    id: newId,
                    name,
                    type,
                    location
                };
                data.universities.push(newUni);
                saveData();
                return resolve({ lastID: newId });
            }

            // 3. INSERT INTO career_university (career_id, university_id) VALUES (?, ?)
            if (/INSERT INTO career_university/i.test(normalizedSql)) {
                const [career_id, university_id] = params;
                data.career_university.push({
                    career_id: Number(career_id),
                    university_id: Number(university_id)
                });
                saveData();
                return resolve({ lastID: null });
            }

            // 4. DELETE FROM career_university WHERE career_id = ?
            if (/DELETE FROM career_university WHERE career_id = \?/i.test(normalizedSql)) {
                const careerId = Number(params[0]);
                data.career_university = data.career_university.filter(cu => cu.career_id !== careerId);
                saveData();
                return resolve({ changes: 1 });
            }

            // 5. DELETE FROM careers WHERE id = ?
            if (/DELETE FROM careers WHERE id = \?/i.test(normalizedSql)) {
                const id = Number(params[0]);
                data.careers = data.careers.filter(c => c.id !== id);
                saveData();
                return resolve({ changes: 1 });
            }

            // 6. DELETE FROM career_university WHERE university_id = ?
            if (/DELETE FROM career_university WHERE university_id = \?/i.test(normalizedSql)) {
                const universityId = Number(params[0]);
                data.career_university = data.career_university.filter(cu => cu.university_id !== universityId);
                saveData();
                return resolve({ changes: 1 });
            }

            // 7. DELETE FROM universities WHERE id = ?
            if (/DELETE FROM universities WHERE id = \?/i.test(normalizedSql)) {
                const id = Number(params[0]);
                data.universities = data.universities.filter(u => u.id !== id);
                saveData();
                return resolve({ changes: 1 });
            }

            reject(new Error(`Operación SQL no soportada por el emulador JSON: ${sql}`));
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    db: {
        serialize: (callback) => callback() // Mock para compatibilidad
    },
    initDatabase,
    query,
    run
};
