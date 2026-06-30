// public/js/views/universities.js
import { fetchUniversities } from '../api.js';

export async function renderUniversities() {
    try {
        const unis = await fetchUniversities();
        
        let html = `
            <div class="glass-panel" style="animation: fadeIn 0.5s ease;">
                <h2 class="section-title">Universidades en Venezuela 🇻🇪</h2>
                <p class="section-subtitle">Conoce las principales instituciones de educación superior del país para tu desarrollo profesional.</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
        `;

        if (unis.length === 0) {
            html += `<p style="color: var(--text-muted); grid-column: 1 / -1;">No hay universidades registradas actualmente.</p>`;
        } else {
            html += unis.map(u => `
                <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--glass-border); transition: transform 0.3s; cursor: default;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <h3 style="color: var(--primary-light); font-size: 1.3rem; margin-bottom: 0.5rem;">${u.name}</h3>
                    <p style="color: var(--text-muted); margin-bottom: 1rem; font-size: 0.95rem;">📍 ${u.location}</p>
                    <span style="display: inline-block; background: ${u.type === 'Pública' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(236, 72, 153, 0.2)'}; color: ${u.type === 'Pública' ? 'var(--primary-light)' : 'var(--secondary)'}; padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600;">
                        Institución ${u.type}
                    </span>
                </div>
            `).join('');
        }

        html += `
                </div>
            </div>
        `;
        return html;
    } catch(err) {
        return `
            <div class="glass-panel">
                <h2 style="color:var(--secondary);">Error al cargar universidades</h2>
                <p>${err.message}</p>
            </div>
        `;
    }
}
