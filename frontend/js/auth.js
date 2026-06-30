async function fazerLogin(email, senha) {
    try {
        const response = await fetch('/api/clientes/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro no login');
        }

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return { success: true, user: data.user };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

function logout() {
    if (confirm('Deseja realmente sair do sistema?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}

function isCliente() {
    const user = getUser();
    return user && user.role === 'cliente';
}

function isAuthenticated() {
    return getToken() !== null;
}

function requireAdmin() {
    if (!isAdmin()) {
        alert('Acesso restrito a administradores');
        window.location.href = 'index.html';
    }
}

async function authenticatedFetch(url, options = {}) {
    const token = getToken();

    if (!token && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        throw new Error('Não autenticado');
    }

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        throw new Error('Sessão expirada');
    }

    return response;
}