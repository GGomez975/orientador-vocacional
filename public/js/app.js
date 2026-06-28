// public/js/app.js
import { renderHome } from './views/home.js';
import { renderTest } from './views/test.js';
import { renderResults } from './views/results.js';
import { renderUniversities } from './views/universities.js';
import { renderAdmin } from './views/admin.js';

const appContent = document.getElementById('app-content');

// Enrutador Simple (SPA)
const router = async () => {
    let hash = window.location.hash.slice(1) || 'home';
    const params = new URLSearchParams(window.location.search);
    
    // Indicador de carga
    appContent.innerHTML = '<div class="glass-panel" style="text-align:center;"><h2>Cargando...</h2></div>';
    
    // Actualizar enlaces de navegación activos
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${hash.split('?')[0]}`) {
            link.classList.add('active');
        }
    });

    try {
        switch (hash.split('?')[0]) {
            case 'home':
                appContent.innerHTML = await renderHome();
                break;
            case 'test':
                await renderTest(appContent);
                break;
            case 'results':
                appContent.innerHTML = await renderResults();
                break;
            case 'universities':
                appContent.innerHTML = await renderUniversities();
                break;
            case 'admin':
                await renderAdmin(appContent);
                break;
            default:
                appContent.innerHTML = await renderHome();
        }
    } catch (err) {
        console.error("Router error:", err);
        appContent.innerHTML = `
            <div class="glass-panel" style="text-align:center;">
                <h2>Error al cargar la vista</h2>
                <p style="color:var(--secondary)">${err.message}</p>
                <br>
                <button class="btn-primary" onclick="window.history.back()">Volver</button>
            </div>
        `;
    }
};

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
