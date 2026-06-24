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
        { q: "¿Qué tipo de proyectos o tareas te entusiasma más liderar o realizar?", 
          options: [
              { text: "Investigar y resolver acertijos lógicos o matemáticos complicados", area: "Básicas" },
              { text: "Planificar la logística y defensa de los derechos de un grupo", area: "Sociales" },
              { text: "Desarrollar la identidad visual, ilustraciones o maquetas del proyecto", area: "Arte" },
              { text: "Crear el código de programación o configurar los servidores", area: "Tecnología" }
          ]
        },
        { q: "¿Qué tema te genera más curiosidad al navegar por internet o leer noticias?", 
          options: [
              { text: "Avances científicos en la cura de enfermedades y bienestar humano", area: "Salud" },
              { text: "Nuevos métodos educativos y el futuro de las escuelas", area: "Educación" },
              { text: "Descubrimientos en física teórica, astronomía o matemáticas avanzadas", area: "Básicas" },
              { text: "Leyes, política internacional y movimientos culturales", area: "Sociales" }
          ]
        },
        { q: "Si pudieras realizar un voluntariado el próximo fin de semana, ¿cuál elegirías?", 
          options: [
              { text: "Apoyar en el desarrollo de herramientas digitales para una ONG", area: "Tecnología" },
              { text: "Dar tutorías y clases de refuerzo a niños con dificultades de aprendizaje", area: "Educación" },
              { text: "Colaborar en campañas de vacunación o jornadas de atención primaria", area: "Salud" },
              { text: "Organizar una galería comunitaria, muralismo o talleres de pintura", area: "Arte" }
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
