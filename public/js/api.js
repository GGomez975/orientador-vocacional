// public/js/api.js
const API_URL = '/api';

export async function fetchCareers(search = '', area = '') {
    let url = `${API_URL}/careers?`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (area) url += `area=${encodeURIComponent(area)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener carreras');
    return await res.json();
}

export async function fetchUniversities() {
    const res = await fetch(`${API_URL}/universities`);
    if (!res.ok) throw new Error('Error al obtener universidades');
    return await res.json();
}

export async function calculateTest(answers) {
    const res = await fetch(`${API_URL}/test/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
    });
    if (!res.ok) throw new Error('Error calculando el resultado del test');
    return await res.json();
}

export async function createCareer(data) {
    const res = await fetch(`${API_URL}/careers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
}

export async function createUniversity(data) {
    const res = await fetch(`${API_URL}/universities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
}

export async function deleteCareer(id) {
    const res = await fetch(`${API_URL}/careers/${id}`, { method: 'DELETE' });
    return await res.json();
}

export async function deleteUniversity(id) {
    const res = await fetch(`${API_URL}/universities/${id}`, { method: 'DELETE' });
    return await res.json();
}

export async function fetchAreas() {
    const res = await fetch(`${API_URL}/areas`);
    if(!res.ok) throw new Error('Error al obtener áreas');
    return await res.json();
}
