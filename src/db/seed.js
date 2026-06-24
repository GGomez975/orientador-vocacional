const dbUtils = require('./database');

async function seed() {
    console.log("Iniciando llenado de datos base...");
    await dbUtils.initDatabase();

    // Insertar áreas principales de forma idempotente
    const defaultAreas = [
        ['Ciencias de la Salud', 'Carreras relacionadas al cuidado, prevención y tratamiento de enfermedades.'],
        ['Ingeniería y Tecnología', 'Carreras basadas en matemáticas, física impulsadas a resolver problemas prácticos.'],
        ['Ciencias Sociales y Humanidades', 'Estudio del comportamiento humano, sociedad, historia y leyes.'],
        ['Ciencias Básicas', 'Matemáticas, física, química o biología puras.'],
        ['Arte y Arquitectura', 'Carreras creativas con un componente estético y funcional.'],
        ['Educación', 'Formación y enseñanza en diversas disciplinas.']
    ];

    for (const [name, description] of defaultAreas) {
        const exists = await dbUtils.query("SELECT id FROM areas WHERE name = ?", [name]);
        if (exists.length === 0) {
            await dbUtils.run("INSERT INTO areas (name, description) VALUES (?, ?)", [name, description]);
        }
    }

    // Insertar universidades de Venezuela de forma idempotente
    const defaultUnis = [
        ['Universidad Central de Venezuela (UCV)', 'Pública', 'Caracas'],
        ['Universidad Simón Bolívar (USB)', 'Pública', 'Caracas'],
        ['Universidad Católica Andrés Bello (UCAB)', 'Privada', 'Caracas / Guayana'],
        ['Universidad de Los Andes (ULA)', 'Pública', 'Mérida'],
        ['Universidad del Zulia (LUZ)', 'Pública', 'Maracaibo'],
        ['Universidad de Carabobo (UC)', 'Pública', 'Valencia'],
        ['Universidad de Oriente (UDO)', 'Pública', 'Oriente (Cumaná / Barcelona)'],
        ['Universidad Metropolitana (UNIMET)', 'Privada', 'Caracas'],
        ['Universidad Centroccidental Lisandro Alvarado (UCLA)', 'Pública', 'Barquisimeto'],
        ['Universidad Católica Santa Rosa (UCSAR)', 'Privada', 'Caracas'],
        ['Universidad Monteávila (UMA)', 'Privada', 'Caracas'],
        ['Universidad Nacional Experimental Politécnica Antonio José de Sucre (UNEXPO)', 'Pública', 'Barquisimeto']
    ];

    for (const [name, type, location] of defaultUnis) {
        const exists = await dbUtils.query("SELECT id FROM universities WHERE name = ?", [name]);
        if (exists.length === 0) {
            await dbUtils.run("INSERT INTO universities (name, type, location) VALUES (?, ?, ?)", [name, type, location]);
        }
    }

    // Obtener IDs de áreas y universidades
    const areas = await dbUtils.query("SELECT id, name FROM areas");
    const unis = await dbUtils.query("SELECT id, name FROM universities");

    // Función auxiliar para obtener ID por nombre
    const getAreaId = (nameMatch) => areas.find(a => a.name.includes(nameMatch))?.id;
    const getUniId = (nameMatch) => unis.find(u => u.name.includes(`(${nameMatch})`))?.id;

    // Insertar carreras
    const careersData = [
        {
            title: 'Medicina',
            description: 'Formación de profesionales capacitados para diagnosticar, tratar y prevenir enfermedades humanas.',
            labor_field: 'Hospitales clínicos, consultorios privados, ambulatorios, investigación, salud pública.',
            duration: '6 años',
            areaMatch: 'Salud',
            unisMatch: ['UCV', 'ULA', 'LUZ', 'UC', 'UDO', 'UCLA']
        },
        {
            title: 'Enfermería',
            description: 'Cuidados integrales de salud a individuos, familias y comunidades.',
            labor_field: 'Clínicas y hospitales, centros de rehabilitación, docencia.',
            duration: '5 años',
            areaMatch: 'Salud',
            unisMatch: ['UCV', 'ULA', 'UC', 'UDO']
        },
        {
            title: 'Ingeniería en Computación',
            description: 'Desarrollo de software, arquitecturas de red, inteligencia artificial y gestión de sistemas informáticos.',
            labor_field: 'Empresas de tecnología, bancos, telecomunicaciones, desarrollo independiente (freelance).',
            duration: '5 años',
            areaMatch: 'Tecnología',
            unisMatch: ['UCV', 'USB', 'UCLA', 'UNEXPO']
        },
        {
            title: 'Ingeniería Informática',
            description: 'Gestión y desarrollo de sistemas de información, bases de datos y seguridad.',
            labor_field: 'Consultoría TI, corporaciones financieras, creación de startups.',
            duration: '5 años',
            areaMatch: 'Tecnología',
            unisMatch: ['UCAB', 'UNIMET', 'UCLA']
        },
        {
            title: 'Psicología',
            description: 'Estudio de los procesos mentales, sensaciones, percepciones y el comportamiento del ser humano.',
            labor_field: 'Clínica, orientación educativa, recursos humanos en empresas.',
            duration: '5 años',
            areaMatch: 'Sociales',
            unisMatch: ['UCV', 'UCAB', 'UCSAR', 'UMA']
        },
        {
            title: 'Arquitectura',
            description: 'Arte y técnica de proyectar, diseñar y construir espacios y edificios.',
            labor_field: 'Constructoras, diseño de interiores, planificación urbana o firmas de arquitectos.',
            duration: '5 años',
            areaMatch: 'Arte',
            unisMatch: ['UCV', 'USB', 'ULA', 'UDO']
        },
        {
            title: 'Educación Mención Informática',
            description: 'Formación de docentes con capacidades metodológicas y tecnológicas para la enseñanza.',
            labor_field: 'Liceos, colegios, universidades, fundaciones educativas.',
            duration: '4 a 5 años',
            areaMatch: 'Educación',
            unisMatch: ['UCAB', 'UMA', 'UDO']
        },
        {
            title: 'Física',
            description: 'Estudio de los fenómenos del universo, desde partículas subatómicas hasta galaxias.',
            labor_field: 'Centros de investigación, docencia universitaria, industria de instrumentación.',
            duration: '5 años',
            areaMatch: 'Básicas',
            unisMatch: ['UCV', 'USB', 'ULA']
        }
    ];

    for (let current of careersData) {
        let areaId = getAreaId(current.areaMatch);
        if(!areaId) {
            console.error("Área no encontrada para: " + current.title);
            continue;
        }

        // Buscar si la carrera ya existe
        let careerDb = await dbUtils.query('SELECT id FROM careers WHERE title = ?', [current.title]);
        let careerId;
        
        if (careerDb.length === 0) {
            let carreraRes = await dbUtils.run(
                'INSERT INTO careers (title, description, labor_field, duration, area_id) VALUES (?, ?, ?, ?, ?)',
                [current.title, current.description, current.labor_field, current.duration, areaId]
            );
            careerId = carreraRes.lastID;
        } else {
            careerId = careerDb[0].id;
        }
        
        // Relacionar carrera con las universidades
        for (let uMatch of current.unisMatch) {
            let uId = getUniId(uMatch);
            if(uId) {
                let relDb = await dbUtils.query(
                    'SELECT 1 FROM career_university WHERE career_id = ? AND university_id = ?', 
                    [careerId, uId]
                );
                if (relDb.length === 0) {
                    await dbUtils.run(
                        'INSERT INTO career_university (career_id, university_id) VALUES (?, ?)',
                        [careerId, uId]
                    );
                }
            }
        }
    }

    console.log("✅ ¡Datos iniciales sembrados con éxito!");
}

seed().then(() => {
    process.exit(0);
}).catch(err => {
    console.error("❌ Error sembrando datos:", err);
    process.exit(1);
});
