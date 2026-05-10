const API_URL = 'http://localhost:5002/livros';

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
                <td><button onclick="deletarLivro(${l.id})">Excluir</button></td>
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
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    e.target.reset();
    carregarLivros();
});

async function deletarLivro(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    carregarLivros();
}

carregarLivros();