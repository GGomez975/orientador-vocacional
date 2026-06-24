const express = require('express');
const router = express.Router();
const db = require('../db/database');

// --- CARRERAS (CRUD) ---

// Obtener todas las carreras (soporta búsqueda y filtro por área)
router.get('/careers', async (req, res) => {
    try {
        const { search, area } = req.query;
        let queryStr = `
            SELECT c.*, a.name as area_name 
            FROM careers c 
            JOIN areas a ON c.area_id = a.id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            queryStr += ` AND c.title LIKE ?`;
            params.push(`%${search}%`);
        }
        if (area) {
            queryStr += ` AND a.name LIKE ?`;
            params.push(`%${area}%`);
        }

        const careers = await db.query(queryStr, params);

        // Adjuntar universidades para cada carrera (Relación N a N)
        for (let career of careers) {
            const unis = await db.query(`
                SELECT u.name, u.type, u.location 
                FROM universities u
                JOIN career_university cu ON u.id = cu.university_id
                WHERE cu.career_id = ?
            `, [career.id]);
            career.universities = unis;
        }

        res.json(careers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear carrera
router.post('/careers', async (req, res) => {
    try {
        const { title, description, labor_field, duration, area_id } = req.body;
        const result = await db.run(
            'INSERT INTO careers (title, description, labor_field, duration, area_id) VALUES (?, ?, ?, ?, ?)',
            [title, description, labor_field, duration, area_id]
        );
        res.status(201).json({ id: result.lastID, message: 'Carrera creada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar carrera
router.delete('/careers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.run('DELETE FROM career_university WHERE career_id = ?', [id]);
        await db.run('DELETE FROM careers WHERE id = ?', [id]);
        res.json({ message: 'Carrera eliminada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- UNIVERSIDADES (CRUD) ---

// Obtener todas
router.get('/universities', async (req, res) => {
    try {
        const unis = await db.query('SELECT * FROM universities');
        res.json(unis);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear universidad
router.post('/universities', async (req, res) => {
    try {
        const { name, type, location } = req.body;
        const result = await db.run(
            'INSERT INTO universities (name, type, location) VALUES (?, ?, ?)',
            [name, type, location]
        );
        res.status(201).json({ id: result.lastID, message: 'Universidad creada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar universidad
router.delete('/universities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.run('DELETE FROM career_university WHERE university_id = ?', [id]);
        await db.run('DELETE FROM universities WHERE id = ?', [id]);
        res.json({ message: 'Universidad eliminada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- AREAS ---
router.get('/areas', async (req, res) => {
    try {
        const areas = await db.query('SELECT * FROM areas');
        res.json(areas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SISTEMA DE RECOMENDACIÓN DEL TEST ---
router.post('/test/calculate', async (req, res) => {
    try {
        const { answers } = req.body;
        // Formato esperado: [{ areaMatch: "Salud", points: 1 }, { areaMatch: "Tecnología", points: 2 }]

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: "Formato de respuestas inválido" });
        }

        // Sumatoria de puntos por cada rubro
        const scores = {};
        for (let ans of answers) {
            scores[ans.areaMatch] = (scores[ans.areaMatch] || 0) + (ans.points || 1);
        }

        // Identificar el área mayoritaria
        let topArea = null;
        let maxScore = -1;
        for (const [area, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                topArea = area;
            }
        }

        if (!topArea) {
            return res.status(400).json({ error: "No se pudo determinar un perfil con las respuestas dadas" });
        }

        // Buscar información extensa del área determinada
        const areaData = await db.query(`SELECT * FROM areas WHERE name LIKE ?`, [`%${topArea}%`]);

        res.json({
            recommendedArea: topArea,
            areaDetails: areaData[0] || null,
            maxScore: maxScore,
            scores: scores
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
