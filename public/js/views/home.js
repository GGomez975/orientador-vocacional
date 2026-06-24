// public/js/views/home.js
export async function renderHome() {
    return `
        <div class="home-container" style="text-align: center; max-width: 800px; margin: 0 auto; padding-top: 5vh;">
            <div class="logo-container" style="margin-bottom: 2rem;">
                <img src="/assets/logo.png" alt="Logo Instituto Br. Elias Cordero U." style="width: 150px; height: 150px; border-radius: 50%; border: 4px solid var(--glass-border); box-shadow: 0 10px 25px rgba(0,0,0,0.4); transition: transform 0.3s ease, box-shadow 0.3s ease; display: inline-block;" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 15px 30px rgba(0,0,0,0.6)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 10px 25px rgba(0,0,0,0.4)';">
            </div>
            <div class="hero-badge" style="background: rgba(236,72,153,0.2); color: var(--secondary); padding: 0.5rem 1.5rem; border-radius: 50px; display: inline-block; margin-bottom: 1.5rem; font-weight: 600; font-size: 0.9rem;">
                Conoce tu futuro en Venezuela ✨
            </div>
            <h1 class="section-title" style="font-size: 3.5rem; line-height: 1.2; margin-bottom: 1.5rem;">
                Descubre qué carrera estudiar y <span style="background: linear-gradient(135deg, var(--primary-light), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">dónde hacerlo</span>
            </h1>
            <p class="section-subtitle" style="font-size: 1.2rem; margin-bottom: 2.5rem;">
                Un test interactivo para estudiantes de bachillerato que te ayuda a encontrar tu vocación y te conecta con las mejores universidades públicas y privadas del país.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="#test" class="btn-primary" style="font-size: 1.1rem; padding: 1rem 2.5rem;">Empezar Test Vocacional</a>
                <a href="#universities" class="btn-secondary" style="font-size: 1.1rem; padding: 1rem 2.5rem;">Ver Universidades</a>
            </div>
            
            <div class="stats-row" style="display: flex; justify-content: center; gap: 3rem; margin-top: 4rem; flex-wrap: wrap;">
                <div>
                    <h3 style="font-size: 2.5rem; font-weight: 800; color: var(--primary-light);">6+</h3>
                    <p style="color: var(--text-muted);">Áreas de estudio</p>
                </div>
                <div>
                    <h3 style="font-size: 2.5rem; font-weight: 800; color: var(--secondary);">Top</h3>
                    <p style="color: var(--text-muted);">Universidades del País</p>
                </div>
                <div>
                    <h3 style="font-size: 2.5rem; font-weight: 800; color: var(--primary-light);">100%</h3>
                    <p style="color: var(--text-muted);">Gratis</p>
                </div>
            </div>
        </div>
    `;
}
