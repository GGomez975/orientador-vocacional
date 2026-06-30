// public/js/views/test.js
export async function renderTest(container) {
    // Preguntas del Test Vocacional
    const questions = [
        { q: "¿Qué actividad disfrutas más en tu tiempo libre?", 
          options: [
              { text: "Leer sobre avances médicos o biología", area: "Salud" },
              { text: "Armar, desarmar o programar dispositivos", area: "Tecnología" },
              { text: "Debatir sobre problemas sociales o historia", area: "Sociales" },
              { text: "Dibujar, diseñar o crear arte visual", area: "Arte" }
          ]
        },
        { q: "Si tuvieras que resolver un problema en tu comunidad, ¿qué harías?", 
          options: [
              { text: "Organizar una campaña de salud preventiva", area: "Salud" },
              { text: "Crear una app para reportar incidencias", area: "Tecnología" },
              { text: "Dar talleres para enseñar nuevas habilidades", area: "Educación" },
              { text: "Diseñar un parque o espacio recreativo", area: "Arte" }
          ]
        },
        { q: "¿En qué materia escolar has destacado más o te da más curiosidad?", 
          options: [
              { text: "Biología o Química", area: "Salud" },
              { text: "Física o Matemáticas", area: "Básicas" },
              { text: "Castellano, Historia o Psicología", area: "Sociales" },
              { text: "Arte o Dibujo Técnico", area: "Arte" }
          ]
        },
        { q: "¿Qué ambiente de trabajo te resulta más atractivo para tu futuro?", 
          options: [
              { text: "Un laboratorio o una clínica", area: "Salud" },
              { text: "Una oficina de desarrollo o innovación tecnológica", area: "Tecnología" },
              { text: "Un espacio de enseñanza o colegio", area: "Educación" },
              { text: "Un estudio asombroso y creativo", area: "Arte" }
          ]
        },
        { q: "¿Cómo te gustaría cambiar el mundo?", 
          options: [
              { text: "Descubriendo tratamientos para enfermedades difíciles", area: "Salud" },
              { text: "Automatizando procesos con Inteligencia Artificial", area: "Tecnología" },
              { text: "Reduciendo la desigualdad a través de leyes y análisis social", area: "Sociales" },
              { text: "Formando a las nuevas generaciones de forma integral", area: "Educación" }
          ]
        },
        { q: "¿Cuál de estos proyectos te entusiasma más desarrollar?", 
          options: [
              { text: "Investigar sobre el funcionamiento de vacunas o tratamientos médicos", area: "Salud" },
              { text: "Desarrollar un sistema de ciberseguridad o red inteligente", area: "Tecnología" },
              { text: "Redactar un ensayo sobre derechos humanos o resolución de conflictos", area: "Sociales" },
              { text: "Hacer el diseño arquitectónico de una biblioteca moderna y ecológica", area: "Arte" }
          ]
        },
        { q: "Si tuvieras que leer un libro por diversión, ¿de qué temática sería?", 
          options: [
              { text: "Descubrimientos del cosmos, física teórica o álgebra", area: "Básicas" },
              { text: "Métodos modernos de enseñanza o psicología del aprendizaje", area: "Educación" },
              { text: "Historia de la medicina y grandes hitos de la cirugía", area: "Salud" },
              { text: "Cómo se crearon las computadoras o el internet", area: "Tecnología" }
          ]
        },
        { q: "¿Qué tipo de problema o reto analítico disfrutas más resolver?", 
          options: [
              { text: "Analizar patrones de datos o deducir fórmulas científicas", area: "Básicas" },
              { text: "Mediar en discusiones complejas para llegar a un acuerdo justo", area: "Sociales" },
              { text: "Explicar conceptos abstractos para que cualquiera los comprenda fácilmente", area: "Educación" },
              { text: "Planificar la distribución espacial y estética de una estructura", area: "Arte" }
          ]
        }
    ];

    let currentQ = 0;
    const answers = [];

    const renderQuestion = () => {
        if(currentQ >= questions.length){
            container.innerHTML = `<div class="glass-panel" style="text-align:center; animation: fadeIn 0.5s ease;">
                <h2>¡Test completado!</h2>
                <p style="color:var(--text-muted); margin-top: 0.5rem;">Analizando tus respuestas y combinando tu vocación...</p>
                <div style="margin: 2rem 0; font-size: 2rem;">🧠 ⚙️ 💡</div>
            </div>`;
            
            setTimeout(() => {
                sessionStorage.setItem('testAnswers', JSON.stringify(answers));
                window.location.hash = '#results';
            }, 1500);
            return;
        }

        const q = questions[currentQ];
        let html = `
            <div class="glass-panel" style="max-width: 600px; margin: 0 auto; animation: fadeIn 0.4s ease;">
                <div style="background: rgba(255,255,255,0.1); border-radius: 5px; height: 6px; width: 100%; margin-bottom: 2rem;">
                    <div style="background: var(--primary-light); width: ${((currentQ) / questions.length) * 100}%; height: 100%; border-radius: 5px; transition: width 0.3s;"></div>
                </div>
                <h3 style="color: var(--primary-light); margin-bottom: 0.5rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Pregunta ${currentQ + 1} de ${questions.length}</h3>
                <h2 style="font-size: 1.5rem; margin-bottom: 2rem; font-weight: 600;">${q.q}</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${q.options.map((opt, i) => `
                        <button class="btn-secondary answer-btn" data-area="${opt.area}" style="text-align: left; padding: 1.2rem; width: 100%; font-weight: 400; border-color: rgba(255,255,255,0.1);">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML = html;

        container.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const area = e.currentTarget.getAttribute('data-area');
                answers.push({ areaMatch: area, points: 1 });
                currentQ++;
                renderQuestion(); // Renderiza la siguiente inmediatamente
            });
        });
    };

    renderQuestion();
}
