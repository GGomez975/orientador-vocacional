// public/js/views/results.js
import { calculateTest, fetchCareers } from '../api.js';

export async function renderResults() {
    const answersData = sessionStorage.getItem('testAnswers');
    if(!answersData) {
        return `
            <div class="glass-panel" style="text-align:center;">
                <h2>No hay resultados disponibles</h2>
                <p>Por favor, realiza el test vocacional primero para descubrir tu perfil ideal.</p>
                <br>
                <a href="#test" class="btn-primary">Ir al Test</a>
            </div>
        `;
    }

    try {
        const answers = JSON.parse(answersData);
        if(answers.length === 0) throw new Error("No encontramos respuestas de tu test.");

        // Llama a nuestra API backend para procesar los resultados analíticamente
        const result = await calculateTest(answers);
        
        // Obtiene las carreras acordes al área con mayor afinidad
        const careers = await fetchCareers('', result.recommendedArea);

        let html = `
            <div class="glass-panel" style="animation: fadeIn 0.5s ease; margin-bottom: 2rem;">
                <h2 style="font-size: 2rem; color: var(--primary-light); margin-bottom: 1rem;">¡Tu perfil es afín a: ${result.recommendedArea}! 🎉</h2>
                <p style="font-size: 1.1rem; line-height: 1.6;">${result.areaDetails ? result.areaDetails.description : 'Un área fundamental para el progreso y creatividad.'}</p>
            </div>
            
            <h3 class="section-title" style="font-size: 1.8rem;">Carreras Recomendadas</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
        `;

        if(careers.length === 0){
            html += `<p style="color:var(--text-muted)">Pronto añadiremos más carreras específicas para este perfil en nuestra base de datos.</p>`;
        } else {
            careers.forEach(c => {
                html += `
                    <div style="background: var(--card-bg); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--glass-border); transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <h4 style="color: var(--secondary); font-size: 1.3rem; margin-bottom: 0.5rem;">${c.title}</h4>
                        <p style="font-size: 0.9rem; margin-bottom: 1rem; color: var(--text-main);">${c.description}</p>
                        
                        <div style="margin-bottom: 1rem;">
                            <strong style="color: var(--primary-light); font-size: 0.9rem;">⏳ Duración:</strong> <span style="font-size: 0.9rem;">${c.duration}</span><br>
                            <strong style="color: var(--primary-light); font-size: 0.9rem;">💼 Laboral:</strong> <span style="font-size: 0.9rem;">${c.labor_field}</span>
                        </div>
                        
                        <!-- Lista de universidades adaptada -->
                        <div>
                            <strong style="font-size: 0.9rem; color: var(--text-muted);">🏢 Se dicta en:</strong>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                                ${c.universities.map(u => `<span style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.05);">${u.name.split(' (')[0]}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        html += `
            </div>
            <div style="text-align:center; margin-top: 3rem;">
                <a href="#test" class="btn-secondary" onclick="sessionStorage.removeItem('testAnswers')">Repetir el Test</a>
            </div>
        `;

        return html;

    } catch(err) {
        return `
            <div class="glass-panel" style="text-align:center;">
                <h2 style="color:var(--secondary)">Hubo un error calculando tus resultados</h2>
                <p>${err.message}</p>
                <a href="#test" class="btn-primary" style="margin-top: 1rem;">Intentar de nuevo</a>
            </div>
        `;
    }
}
