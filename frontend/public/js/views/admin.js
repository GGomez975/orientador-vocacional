// public/js/views/admin.js
import { fetchCareers, fetchUniversities, fetchAreas, createCareer, createUniversity, deleteCareer, deleteUniversity } from '../api.js';

export async function renderAdmin(container) {
    container.innerHTML = `<div class="glass-panel" style="text-align:center;"><div class="loader">Cargando datos del panel administrativo...</div></div>`;

    try {
        // Carga concurrente de todos los datos necesarios
        const [careers, unis, areas] = await Promise.all([
            fetchCareers(),
            fetchUniversities(),
            fetchAreas()
        ]);

        let html = `
            <div style="animation: fadeIn 0.5s ease;">
                <h2 class="section-title" style="text-align:center;">Panel de Administración</h2>
                <p class="section-subtitle" style="text-align:center;">Agrega, elimina y actualiza la oferta académica fácilmente.</p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin-top: 2rem;">
                    
                    <!-- Formulario de Carreras -->
                    <div class="glass-panel">
                        <h3 style="color: var(--primary-light); margin-bottom: 1.5rem; font-size: 1.5rem;">Gestión de Carreras</h3>
                        
                        <form id="formCareer" style="margin-bottom: 2rem;">
                            <input type="text" id="cTitle" placeholder="Título de la carrera (Ej. Odontología)" required class="glass-input">
                            <textarea id="cDesc" placeholder="Descripción breve de la carrera..." required class="glass-input" rows="3"></textarea>
                            <input type="text" id="cLabor" placeholder="Campo Laboral en Venezuela" required class="glass-input">
                            <input type="text" id="cDuration" placeholder="Duración estimada (ej. 5 años)" required class="glass-input">
                            <select id="cArea" required class="glass-input" style="appearance: auto; cursor: pointer; color: black; background: white;">
                                <option value="">-- Selecciona el Área de Conocimiento --</option>
                                ${areas.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
                            </select>
                            <button type="submit" class="btn-primary" style="width: 100%;">Agregar Carrera</button>
                        </form>

                        <div style="max-height: 400px; overflow-y: auto; padding-right: 0.5rem;" class="custom-scrollbar">
                            ${careers.map(c => `
                                <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.05);">
                                    <div>
                                        <strong style="color: white;">${c.title}</strong>
                                        <div style="font-size: 0.8rem; color: var(--text-muted);">${c.area_name}</div>
                                    </div>
                                    <button class="btn-del-career" data-id="${c.id}" aria-label="Eliminar Carrera" style="background: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.3); color: var(--secondary); cursor: pointer; padding: 0.4rem; border-radius: 6px; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🗑️</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Formulario de Universidades -->
                    <div class="glass-panel">
                        <h3 style="color: var(--primary-light); margin-bottom: 1.5rem; font-size: 1.5rem;">Gestión de Universidades</h3>
                        
                        <form id="formUni" style="margin-bottom: 2rem;">
                            <input type="text" id="uName" placeholder="Nombre completo (ej. Universidad de Oriente)" required class="glass-input">
                            <select id="uType" required class="glass-input" style="appearance: auto; cursor: pointer; color: black; background: white;">
                                <option value="Pública">Pública</option>
                                <option value="Privada">Privada</option>
                            </select>
                            <input type="text" id="uLocation" placeholder="Ubicación (ej. Cumaná)" required class="glass-input">
                            <button type="submit" class="btn-primary" style="width: 100%;">Agregar Universidad</button>
                        </form>

                        <div style="max-height: 400px; overflow-y: auto; padding-right: 0.5rem;" class="custom-scrollbar">
                            ${unis.map(u => `
                                <div style="background: rgba(15, 23, 42, 0.5); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.05);">
                                    <div>
                                        <strong style="color: white;">${u.name}</strong>
                                        <div style="font-size: 0.8rem; color: var(--text-muted);">${u.type} - ${u.location}</div>
                                    </div>
                                    <button class="btn-del-uni" data-id="${u.id}" aria-label="Eliminar Universidad" style="background: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.3); color: var(--secondary); cursor: pointer; padding: 0.4rem; border-radius: 6px; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">🗑️</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                </div>
            </div>
        `;

        container.innerHTML = html;

        // --- MANEJADORES DE EVENTOS ---

        // Crear carrera
        document.getElementById('formCareer').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.submitter;
            btn.disabled = true;
            btn.innerText = "Guardando...";
            
            try {
                await createCareer({
                    title: document.getElementById('cTitle').value,
                    description: document.getElementById('cDesc').value,
                    labor_field: document.getElementById('cLabor').value,
                    duration: document.getElementById('cDuration').value,
                    area_id: document.getElementById('cArea').value
                });
                renderAdmin(container); // Recarga automática
            } catch(err) { 
                alert(err.message); 
                btn.disabled = false;
                btn.innerText = "Agregar Carrera";
            }
        });

        // Crear universidad
        document.getElementById('formUni').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.submitter;
            btn.disabled = true;
            btn.innerText = "Guardando...";

            try {
                await createUniversity({
                    name: document.getElementById('uName').value,
                    type: document.getElementById('uType').value,
                    location: document.getElementById('uLocation').value
                });
                renderAdmin(container); // Recarga automática
            } catch(err) { 
                alert(err.message);
                btn.disabled = false;
                btn.innerText = "Agregar Universidad";
            }
        });

        // Eliminar elementos
        container.querySelectorAll('.btn-del-career').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if(confirm('¿Estás seguro de eliminar esta carrera de la base de datos?')) {
                    e.currentTarget.disabled = true;
                    await deleteCareer(e.currentTarget.getAttribute('data-id'));
                    renderAdmin(container);
                }
            });
        });

        container.querySelectorAll('.btn-del-uni').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if(confirm('¿Estás seguro de eliminar esta universidad de la base de datos?')) {
                    e.currentTarget.disabled = true;
                    await deleteUniversity(e.currentTarget.getAttribute('data-id'));
                    renderAdmin(container);
                }
            });
        });

    } catch (err) {
        container.innerHTML = `<div class="glass-panel"><p style="color:var(--secondary)">Error en panel de administrador: ${err.message}</p></div>`;
    }
}
