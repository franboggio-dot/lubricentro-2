/**
 * Admin Panel Logic (Protected)
 */

const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const loginForm = document.getElementById('adminLoginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const tableContainer = document.getElementById('tableContainer');
    const viewTitle = document.getElementById('viewTitle');

    // Navigation items
    const navContacts = document.getElementById('navContacts');
    const navQuotes = document.getElementById('navQuotes');

    // Check token
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
    }

    // Login logic
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: pass })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('adminToken', data.token);
                showDashboard();
            } else {
                errorDiv.innerText = data.error || 'Credenciales inválidas';
            }
        } catch (err) {
            errorDiv.innerText = 'Error de conexión';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        location.reload();
    });

    // Nav switch
    navContacts?.addEventListener('click', () => {
        setActiveNav(navContacts);
        viewTitle.innerText = 'Mensajes de Contacto';
        fetchData('contact');
    });

    navQuotes?.addEventListener('click', () => {
        setActiveNav(navQuotes);
        viewTitle.innerText = 'Cotizaciones de Flotas';
        fetchData('quotes');
    });

    function showDashboard() {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'grid';
        fetchData('contact'); // Default view
    }

    function setActiveNav(el) {
        document.querySelectorAll('.nav-admin li').forEach(li => li.classList.remove('active'));
        el.classList.add('active');
    }

    async function fetchData(type) {
        const token = localStorage.getItem('adminToken');
        tableContainer.innerHTML = '<p>Cargando...</p>';

        try {
            const res = await fetch(`${API_BASE}/${type}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('adminToken');
                location.reload();
                return;
            }

            const data = await res.json();
            renderTable(type, data);
        } catch (err) {
            tableContainer.innerHTML = '<p style="color: red;">Error al cargar datos.</p>';
        }
    }

    function renderTable(type, data) {
        if (!data.length) {
            tableContainer.innerHTML = '<p>No hay registros disponibles.</p>';
            return;
        }

        let html = '<table><thead><tr>';
        
        if (type === 'contact') {
            html += '<th>Fecha</th><th>Nombre</th><th>Email</th><th>Servicio</th><th>Mensaje</th>';
        } else {
            html += '<th>Fecha</th><th>Empresa</th><th>Contacto</th><th>Flota</th><th>Servicio</th>';
        }
        
        html += '</tr></thead><tbody>';

        data.forEach(item => {
            const date = new Date(item.createdAt).toLocaleDateString();
            if (type === 'contact') {
                html += `<tr><td>${date}</td><td>${item.nombre}</td><td>${item.email}</td><td>${item.servicio}</td><td>${item.mensaje}</td></tr>`;
            } else {
                html += `<tr><td>${date}</td><td>${item.empresa}</td><td>${item.contacto}</td><td>${item.cantidadFlota}</td><td>${item.tipoServicio}</td></tr>`;
            }
        });

        html += '</tbody></table>';
        tableContainer.innerHTML = html;
    }
});
