const API_URL = "/api/livros";
let editandoId = null;

// ── Carregar e renderizar tabela ───────────────────────────────────────────

async function carregarLivros() {
    try {
        const response = await authenticatedFetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar');
        const livros = await response.json();
        tbody.innerHTML = '';
        
        // No topo, depois das constantes
        if (!isAuthenticated() && window.location.pathname !== '/login.html') {
            window.location.href = 'login.html';
        }

        if (!livros.length) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Nenhum livro cadastrado.</td></tr>';
            return;
        }

        livros.forEach(l => {
            tbody.innerHTML += `
                <tr>
                    <td>${l.titulo}</td>
                    <td>${l.autor}</td>
                    <td>${l.ano || '-'}</td>
                    <td>${l.disponivel ? '✅ Sim' : '❌ Não'}</td>
                    <td>
                        <button onclick="prepararEdicao(${l.id}, '${esc(l.titulo)}', '${esc(l.autor)}', ${l.ano || 'null'})">Editar</button>
                        <button onclick="deletarLivro(${l.id})" style="background:#e74c3c">Excluir</button>
                    </td>
                </tr>`;
        });
    } catch (err) {
        console.error('Erro ao carregar livros:', err);
        document.getElementById('tabela-livros-body').innerHTML = //<-- Essa linha e a de baixo ficam?
            '<tr><td colspan="5" style="color:red;text-align:center">Erro ao conectar com o serviço de livros.</td></tr>';
    }
}

// ── Salvar (criar ou atualizar) ────────────────────────────────────────────

document.getElementById('livro-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        titulo: e.target.titulo.value.trim(),
        autor:  e.target.autor.value.trim(),
        ano:    e.target.ano.value ? parseInt(e.target.ano.value) : null
    };

    const url    = editandoId ? `${API_URL}/${editandoId}` : API_URL;
    const metodo = editandoId ? 'PUT' : 'POST';

    try {
        const response = await authenticatedFetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' }, //<-- Essa linha fica?
            body: JSON.stringify(dados)
        });
        const data = await res.json();
        if (!response.ok) { alert(data.erro || 'Erro ao salvar livro.'); return; }
        cancelarEdicao();
        carregarLivros();
    } catch (err) {
        alert('Erro ao conectar com o serviço de livros.');
    }
});

// ── Preparar edição ────────────────────────────────────────────────────────

function prepararEdicao(id, titulo, autor, ano) {
    editandoId = id;
    const form = document.getElementById('livro-form');
    form.titulo.value = titulo;
    form.autor.value  = autor;
    form.ano.value    = ano !== null ? ano : '';

    document.getElementById('form-titulo').innerText       = 'Editar Livro';
    document.getElementById('btn-salvar').innerText        = 'Atualizar Livro';
    document.getElementById('btn-cancelar').style.display = 'inline-block';

    form.scrollIntoView({ behavior: 'smooth' });
}

function cancelarEdicao() {
    editandoId = null;
    document.getElementById('livro-form').reset();
    document.getElementById('form-titulo').innerText       = 'Cadastrar Novo Livro';
    document.getElementById('btn-salvar').innerText        = 'Salvar Livro';
    document.getElementById('btn-cancelar').style.display = 'none';
}

// ── Excluir ────────────────────────────────────────────────────────────────

async function deletarLivro(id) {
    if (!confirm('Tem certeza que deseja excluir este livro?')) return;
    try {
        const response = await authenticatedFetch(`${API_URL}/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!response.ok) { alert(data.erro || 'Erro ao excluir livro.'); return; }
        carregarLivros();
    } catch (err) {
        alert('Erro ao conectar com o serviço de livros.');
    }
}

// ── Utilitário ─────────────────────────────────────────────────────────────

function esc(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// ── Init ───────────────────────────────────────────────────────────────────

carregarLivros();
