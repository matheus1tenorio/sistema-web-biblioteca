const API_URL = 'http://localhost:5001/clientes';
let editandoId = null;

async function carregarClientes() {
    try {
        const res = await fetch(API_URL);
        const clientes = await res.json();
        const tbody = document.getElementById('tabela-clientes-body');
        tbody.innerHTML = '';
        clientes.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.nome}</td>
                    <td>${c.email}</td>
                    <td>${c.matricula}</td>
                    <td>
                        <button onclick="prepararEdicao(${c.id}, '${c.nome}', '${c.email}', '${c.matricula}')">Editar</button>
                        <button onclick="deletarCliente(${c.id})" style="background:#e74c3c">Excluir</button>
                    </td>
                </tr>`;
        });
    } catch (err) { console.error("Erro ao carregar clientes", err); }
}

async function salvarCliente(e) {
    e.preventDefault();
    const form = e.target;
    const dados = {
        nome: form.nome_usuario.value,
        email: form.email_usuario.value,
        matricula: form.matricula.value
    };

    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;
    const metodo = editandoId ? 'PUT' : 'POST';

    await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    cancelarEdicao();
    carregarClientes();
}

function prepararEdicao(id, nome, email, matricula) {
    editandoId = id;
    const form = document.getElementById('usuario-form');
    form.nome_usuario.value = nome;
    form.email_usuario.value = email;
    form.matricula.value = matricula;
    document.getElementById('form-titulo').innerText = "Editar Usuário";
    document.getElementById('btn-cancelar').style.display = "inline";
}

function cancelarEdicao() {
    editandoId = null;
    document.getElementById('usuario-form').reset();
    document.getElementById('btn-cancelar').style.display = "none";
    document.getElementById('form-titulo').innerText = "Cadastrar Novo Usuário";
}

async function deletarCliente(id) {
    if(confirm("Deseja excluir?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        carregarClientes();
    }
}

document.getElementById('usuario-form').addEventListener('submit', salvarCliente);
carregarClientes();