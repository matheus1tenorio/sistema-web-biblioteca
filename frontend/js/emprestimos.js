const API_EMP = "/api/emprestimos";
const API_CLI = "/api/clientes";
const API_LIV = "/api/livros";

async function carregarEmprestimos() {
    try {
        const res = await authenticatedFetch(API_EMP);

        if (!res.ok) {
            throw new Error("Erro ao buscar empréstimos");
        }

        const emprestimos = await res.json();
        const tbody = document.getElementById('tabela-emprestimos-body');
        tbody.innerHTML = '';

        if (!isAuthenticated() && window.location.pathname !== '/login.html') {
            window.location.href = 'login.html';
        }

        if (!emprestimos.length) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Nenhum empréstimo registrado.</td></tr>';
            return;
        }

        emprestimos.forEach(e => {
            const devolvido = !!e.data_devolucao;

            tbody.innerHTML += `
                <tr>
                    <td>${e.cliente_nome || e.cliente_id}</td>
                    <td>${e.livro_titulo || e.livro_id}</td>
                    <td>${formatarData(e.data_emprestimo)}</td>
                    <td>${e.data_devolucao ? formatarData(e.data_devolucao) : '-'}</td>
                    <td>${devolvido ? 'Devolvido' : 'Pendente'}</td>
                    <td>
                        ${!devolvido
                            ? `<button style="background:#f39c12" onclick="devolverLivro(${e.id})">Devolver</button>`
                            : ''}
                        <button class="btn-delete" onclick="excluirEmprestimo(${e.id})">Excluir</button>
                    </td>
                </tr>`;
        });

    } catch (err) {
        console.error('Erro ao carregar empréstimos:', err);
        document.getElementById('tabela-emprestimos-body').innerHTML =
            '<tr><td colspan="6" style="color:red;text-align:center">Erro ao conectar com o serviço.</td></tr>';
    }
}

async function carregarDropdowns() {
    try {
        const [resU, resL] = await Promise.all([
            authenticatedFetch(API_CLI),
            authenticatedFetch(API_LIV)
        ]);

        const usuarios = await resU.json();
        const livros = await resL.json();

        const selU = document.getElementById('select-usuario');
        const selL = document.getElementById('select-livro');

        selU.innerHTML = '<option value="">Selecione o Usuário</option>';
        usuarios.forEach(u => {
            selU.innerHTML += `<option value="${u.id}">${u.nome}</option>`;
        });

        selL.innerHTML = '<option value="">Selecione o Livro</option>';
        livros
            .filter(l => l.disponivel)
            .forEach(l => {
                selL.innerHTML += `<option value="${l.id}">${l.titulo} — ${l.autor}</option>`;
            });

    } catch (err) {
        console.error('Erro ao carregar dropdowns:', err);
    }
}

document.getElementById('emprestimo-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const clienteId = document.getElementById('select-usuario').value;
    const livroId = document.getElementById('select-livro').value;

    const dados = {
        cliente_id: parseInt(clienteId),
        livro_id: parseInt(livroId)
    };

    try {
        const res = await authenticatedFetch(API_EMP, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.erro || 'Erro ao registrar empréstimo.');
            return;
        }

        e.target.reset();
        await Promise.all([carregarEmprestimos(), carregarDropdowns()]);

    } catch (err) {
        alert('Erro ao conectar com o serviço de empréstimos.');
    }
});

async function devolverLivro(id) {
    if (!confirm('Confirmar devolução deste livro?')) return;

    const hoje = new Date().toISOString().split('T')[0];

    try {
        const res = await authenticatedFetch(`${API_EMP}/${id}/devolver`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data_devolucao: hoje })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.erro || 'Erro ao registrar devolução.');
            return;
        }

        await Promise.all([carregarEmprestimos(), carregarDropdowns()]);

    } catch (err) {
        alert('Erro ao conectar com o serviço de empréstimos.');
    }
}

async function excluirEmprestimo(id) {
    if (!confirm('Excluir este empréstimo?')) return;

    try {
        const res = await authenticatedFetch(`${API_EMP}/${id}`, {
            method: 'DELETE'
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.erro || 'Erro ao excluir.');
            return;
        }

        await Promise.all([carregarEmprestimos(), carregarDropdowns()]);

    } catch (err) {
        alert('Erro ao conectar com o serviço de empréstimos.');
    }
}

function formatarData(dataStr) {
    if (!dataStr) return '-';
    const [ano, mes, dia] = dataStr.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
}

carregarEmprestimos();
carregarDropdowns();