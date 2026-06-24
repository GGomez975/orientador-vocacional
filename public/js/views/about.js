// public/js/views/about.js
export async function renderAbout(container) {
    const key = 'orientador_authors';
    
    // Cargar autores desde localStorage o usar valores predeterminados
    let authors = JSON.parse(localStorage.getItem(key));
    if (!authors || !Array.isArray(authors)) {
        authors = [
            "Instituto Br. Elias Cordero U.",
            "Comisión Técnica de Orientación Vocacional"
        ];
        localStorage.setItem(key, JSON.stringify(authors));
    }

    const render = () => {
        container.innerHTML = `
            <style>
                .about-logo-wrapper {
                    position: absolute;
                    top: 2.5rem;
                    right: 2.5rem;
                    width: 100px;
                    height: 100px;
                    z-index: 10;
                }
                .about-title-wrapper {
                    padding-right: 120px;
                }
                @media (max-width: 600px) {
                    .about-logo-wrapper {
                        position: static !important;
                        margin: 0 auto 1.5rem auto !important;
                        text-align: center;
                        width: 120px;
                        height: 120px;
                    }
                    .about-title-wrapper {
                        padding-right: 0 !important;
                        text-align: center;
                    }
                }
            </style>
            
            <div class="glass-panel" style="position: relative; max-width: 800px; margin: 0 auto; animation: fadeIn 0.5s ease;">
                
                <!-- Logo institucional en la parte superior derecha (responsivo) -->
                <div class="about-logo-wrapper">
                    <img src="/assets/logo.png" alt="Logo de la Institución" style="width: 100%; height: 100%; border-radius: 50%; border: 3px solid var(--glass-border); box-shadow: 0 8px 20px rgba(0,0,0,0.3); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
                </div>

                <div class="about-title-wrapper">
                    <h2 class="section-title" style="margin-bottom: 0.5rem; font-size: 2.2rem; color: var(--primary-light);">Acerca del Proyecto</h2>
                    <span style="display: inline-block; background: rgba(129, 140, 248, 0.2); color: var(--primary-light); padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem;">
                        Versión 1.1.0
                    </span>
                </div>

                <p class="section-subtitle" style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 2rem; clear: both;">
                    Este <strong>Orientador Vocacional</strong> es una herramienta interactiva diseñada especialmente para estudiantes de bachillerato (5to año) en Venezuela. Su objetivo es brindar orientación vocacional personalizada a través de un test adaptativo y conectar a los futuros profesionales con la oferta académica de las universidades públicas y privadas de la nación.
                </p>

                <hr style="border: 0; border-top: 1px solid var(--glass-border); margin: 2rem 0;">

                <h3 style="color: var(--secondary); font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600;">Autores y Colaboradores</h3>
                
                <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 1.5rem;">
                    
                    <!-- Formulario para agregar autores -->
                    <div style="background: rgba(15, 23, 42, 0.4); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
                        <h4 style="margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-main);">Agregar Autor / Colaborador</h4>
                        <form id="add-author-form" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <input type="text" id="author-name-input" placeholder="Nombre completo del autor" required class="glass-input" style="flex: 1; margin-bottom: 0; min-width: 200px;">
                            <button type="submit" class="btn-primary" style="padding: 0.8rem 1.8rem;">Agregar</button>
                        </form>
                    </div>

                    <!-- Listado de autores -->
                    <div>
                        <h4 style="margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-muted);">Listado Actual</h4>
                        <div id="authors-list" style="display: flex; flex-direction: column; gap: 0.8rem;">
                            ${authors.map((author, index) => `
                                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.8rem 1.2rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); transition: background 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                                    <span style="color: var(--text-main); font-weight: 500; font-size: 1.05rem;">👤 ${author}</span>
                                    <button class="delete-author-btn" data-index="${index}" style="background: none; border: none; color: var(--secondary); cursor: pointer; font-size: 1.1rem; padding: 0.2rem; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" aria-label="Eliminar autor">
                                        🗑️
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                </div>

            </div>
        `;

        // Registrar manejadores de eventos
        const form = container.querySelector('#add-author-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = container.querySelector('#author-name-input');
            const name = input.value.trim();
            if (name) {
                authors.push(name);
                localStorage.setItem(key, JSON.stringify(authors));
                render(); // Volver a renderizar
            }
        });

        const deleteButtons = container.querySelectorAll('.delete-author-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                if (confirm(`¿Estás seguro de eliminar a "${authors[idx]}" de la lista de autores?`)) {
                    authors.splice(idx, 1);
                    localStorage.setItem(key, JSON.stringify(authors));
                    render();
                }
            });
        });
    };

    render();
}
