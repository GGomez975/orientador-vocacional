import dbUtils from ('./database');

async function seed() {
    console.log("Iniciando llenado de datos base...");
    await dbUtils.initDatabase();

    // Comprobar si ya hay áreas
    const result = await dbUtils.query("SELECT COUNT(*) as count FROM areas");
    if (result[0].count > 0) {
        console.log("⚠️ La base de datos ya contiene datos. ABORTANDO semilla para no duplicar.");
        process.exit(0);
    }

    // Insertar áreas principales
    await dbUtils.run(`INSERT INTO areas (name, description) VALUES 
        ('Ciencias de la Salud', 'Carreras relacionadas al cuidado, prevención y tratamiento de enfermedades.'),
        ('Ingeniería y Tecnología', 'Carreras basadas en matemáticas, física impulsadas a resolver problemas prácticos.'),
        ('Ciencias Sociales y Humanidades', 'Estudio del comportamiento humano, sociedad, historia y leyes.'),
        ('Ciencias Básicas', 'Matemáticas, física, química o biología puras.'),
        ('Arte y Arquitectura', 'Carreras creativas con un componente estético y funcional.'),
        ('Educación', 'Formación y enseñanza en diversas disciplinas.')
    `);

    // Insertar universidades de Venezuela (Públicas y Privadas)
    await dbUtils.run(`INSERT INTO universities (name, type, location) VALUES 
        ('Universidad Central de Venezuela (UCV)', 'Pública', 'Caracas'),
        ('Universidad Simón Bolívar (USB)', 'Pública', 'Caracas'),
        ('Universidad Católica Andrés Bello (UCAB)', 'Privada', 'Caracas / Guayana'),
        ('Universidad de Los Andes (ULA)', 'Pública', 'Mérida'),
        ('Universidad del Zulia (LUZ)', 'Pública', 'Maracaibo'),
        ('Universidad de Carabobo (UC)', 'Pública', 'Valencia')
    `);

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
            unisMatch: ['UCV', 'ULA', 'LUZ', 'UC']
        },
        {
            title: 'Enfermería',
            description: 'Cuidados integrales de salud a individuos, familias y comunidades.',
            labor_field: 'Clínicas y hospitales, centros de rehabilitación, docencia.',
            duration: '5 años',
            areaMatch: 'Salud',
            unisMatch: ['UCV', 'ULA', 'UC']
        },
        {
            title: 'Ingeniería en Computación',
            description: 'Desarrollo de software, arquitecturas de red, inteligencia artificial y gestión de sistemas informáticos.',
            labor_field: 'Empresas de tecnología, bancos, telecomunicaciones, desarrollo independiente (freelance).',
            duration: '5 años',
            areaMatch: 'Tecnología',
            unisMatch: ['UCV', 'USB']
        },
        {
            title: 'Ingeniería Informática',
            description: 'Gestión y desarrollo de sistemas de información, bases de datos y seguridad.',
            labor_field: 'Consultoría TI, corporaciones financieras, creación de startups.',
            duration: '5 años',
            areaMatch: 'Tecnología',
            unisMatch: ['UCAB']
        },
        {
            title: 'Psicología',
            description: 'Estudio de los procesos mentales, sensaciones, percepciones y el comportamiento del ser humano.',
            labor_field: 'Clínica, orientación educativa, recursos humanos en empresas.',
            duration: '5 años',
            areaMatch: 'Sociales',
            unisMatch: ['UCV', 'UCAB']
        },
        {
            title: 'Arquitectura',
            description: 'Arte y técnica de proyectar, diseñar y construir espacios y edificios.',
            labor_field: 'Constructoras, diseño de interiores, planificación urbana o firmas de arquitectos.',
            duration: '5 años',
            areaMatch: 'Arte',
            unisMatch: ['UCV', 'USB', 'ULA']
        },
        {
            title: 'Educación Mención Informática',
            description: 'Formación de docentes con capacidades metodológicas y tecnológicas para la enseñanza.',
            labor_field: 'Liceos, colegios, universidades, fundaciones educativas.',
            duration: '4 a 5 años',
            areaMatch: 'Educación',
            unisMatch: ['UCAB']
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

        let carreraRes = await dbUtils.run(
            'INSERT INTO careers (title, description, labor_field, duration, area_id) VALUES (?, ?, ?, ?, ?)',
            [current.title, current.description, current.labor_field, current.duration, areaId]
        );
        
        // Relacionar carrera con las universidades
        for (let uMatch of current.unisMatch) {
            let uId = getUniId(uMatch);
            if(uId) {
                await dbUtils.run(
                    'INSERT INTO career_university (career_id, university_id) VALUES (?, ?)',
                    [carreraRes.lastID, uId]
                );
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
