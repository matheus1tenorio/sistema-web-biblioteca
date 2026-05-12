const API_URL = 'http://localhost:5002/livros';
let editandoId = null;

async function carregarLivros() {
    const res = await fetch(API_URL);
    const livros = await res.json();

    const tbody = document.getElementById('tabela-livros-body');
    tbody.innerHTML = '';

    livros.forEach(l => {
        tbody.innerHTML += `
            <tr>
                <td>${l.titulo}</td>
                <td>${l.autor}</td>
                <td>${l.ano}</td>
                <td>${l.disponivel ? 'Sim' : 'Não'}</td>
                <td>
                    <button onclick="prepararEdicao(${l.id}, '${l.titulo}', '${l.autor}', '${l.ano}')">Editar</button>
                    <button onclick="deletarLivro(${l.id})">Excluir</button>
                </td>
            </tr>`;
    });
}

document.getElementById('livro-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        titulo: e.target.titulo.value,
        autor: e.target.autor.value,
        ano: e.target.ano.value
    };

    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;
    const metodo = editandoId ? 'PUT' : 'POST';

    await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    cancelarEdicao();
    carregarLivros();
});

function prepararEdicao(id, titulo, autor, ano) {
    editandoId = id;

    const form = document.getElementById('livro-form');
    form.titulo.value = titulo;
    form.autor.value = autor;
    form.ano.value = ano;
}

function cancelarEdicao() {
    editandoId = null;
    document.getElementById('livro-form').reset();
}

async function deletarLivro(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    carregarLivros();
}

carregarLivros();