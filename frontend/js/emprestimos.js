const API_EMP = "/api/emprestimos";
const API_CLI = "/api/clientes";
const API_LIV = "/api/livros";

// ======================
// Cache
// ======================

const CACHE_EMP = "cache_emprestimos";
const CACHE_CLIENTES = "cache_clientes";
const CACHE_LIVROS = "cache_livros";

// ======================
// Carregar tabela de empréstimos
// ======================

async function carregarEmprestimos() {
    const tbody = document.getElementById("tabela-emprestimos-body");

    // Usa cache primeiro
    const cache = sessionStorage.getItem(CACHE_EMP);

    if (cache) {
        renderizarEmprestimos(JSON.parse(cache));
    }

    try {
        const res = await authenticatedFetch(API_EMP);

        if (!res.ok) throw new Error("Erro ao buscar empréstimos");

        const emprestimos = await res.json();

        sessionStorage.setItem(CACHE_EMP, JSON.stringify(emprestimos));

        renderizarEmprestimos(emprestimos);

    } catch (err) {
        console.error("Erro ao carregar empréstimos:", err);

        if (!cache) {
            tbody.innerHTML =
                '<tr><td colspan="6" style="color:red;text-align:center">Erro ao conectar com o serviço.</td></tr>';
        }
    }
}

function renderizarEmprestimos(emprestimos) {
    const tbody = document.getElementById("tabela-emprestimos-body");

    tbody.innerHTML = "";

    if (!emprestimos.length) {
        tbody.innerHTML =
            '<tr><td colspan="6" style="text-align:center">Nenhum empréstimo registrado.</td></tr>';
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
                    ${
                        !devolvido
                            ? `<button style="background:#f39c12" onclick="devolverLivro(${e.id})">Devolver</button>`
                            : ""
                    }
                    <button class="btn-delete" onclick="excluirEmprestimo(${e.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

// Preencher selects

async function carregarDropdowns() {

    const cacheClientes = sessionStorage.getItem(CACHE_CLIENTES);
    const cacheLivros = sessionStorage.getItem(CACHE_LIVROS);

    if (cacheClientes && cacheLivros) {
        renderizarDropdowns(
            JSON.parse(cacheClientes),
            JSON.parse(cacheLivros)
        );
    }

    try {

        const [resU, resL] = await Promise.all([
            authenticatedFetch(API_CLI),
            authenticatedFetch(API_LIV)
        ]);

        const usuarios = await resU.json();
        const livros = await resL.json();

        sessionStorage.setItem(CACHE_CLIENTES, JSON.stringify(usuarios));
        sessionStorage.setItem(CACHE_LIVROS, JSON.stringify(livros));

        renderizarDropdowns(usuarios, livros);

    } catch (err) {
        console.error("Erro ao carregar dropdowns:", err);
    }
}

function renderizarDropdowns(usuarios, livros) {

    const selU = document.getElementById("select-usuario");
    const selL = document.getElementById("select-livro");

    selU.innerHTML = '<option value="">Selecione o Usuário</option>';

    usuarios.forEach(u => {
        selU.innerHTML += `
            <option value="${u.id}">
                ${u.nome}
            </option>
        `;
    });

    selL.innerHTML = '<option value="">Selecione o Livro</option>';

    livros
        .filter(l => l.disponivel)
        .forEach(l => {

            selL.innerHTML += `
                <option value="${l.id}">
                    ${l.titulo} — ${l.autor}
                </option>
            `;
        });
}

// Registrar empréstimo

document.getElementById("emprestimo-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const dados = {
        cliente_id: parseInt(document.getElementById("select-usuario").value),
        livro_id: parseInt(document.getElementById("select-livro").value),
        data_emprestimo: document.getElementById("data-emprestimo").value
    };

    try {

        const res = await authenticatedFetch(API_EMP, {
            method: "POST",
            body: JSON.stringify(dados)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.erro || "Erro ao registrar empréstimo.");
            return;
        }

        sessionStorage.removeItem(CACHE_EMP);
        sessionStorage.removeItem(CACHE_LIVROS);

        e.target.reset();

        await Promise.all([
            carregarEmprestimos(),
            carregarDropdowns()
        ]);

    } catch (err) {
        alert("Erro ao conectar com o serviço de empréstimos.");
    }
});

// Devolver livro

async function devolverLivro(id) {

    if (!confirm("Confirmar devolução deste livro?")) return;

    const hoje = new Date().toISOString().split("T")[0];

    try {

        const res = await authenticatedFetch(`${API_EMP}/${id}/devolver`, {
            method: "PUT",
            body: JSON.stringify({
                data_devolucao: hoje
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.erro || "Erro ao registrar devolução.");
            return;
        }

        sessionStorage.removeItem(CACHE_EMP);
        sessionStorage.removeItem(CACHE_LIVROS);

        await Promise.all([
            carregarEmprestimos(),
            carregarDropdowns()
        ]);

    } catch (err) {
        alert("Erro ao conectar com o serviço de empréstimos.");
    }
}

// Excluir empréstimo

async function excluirEmprestimo(id) {

    if (!confirm("Excluir este empréstimo?")) return;

    try {

        const res = await authenticatedFetch(`${API_EMP}/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.erro || "Erro ao excluir.");
            return;
        }

        sessionStorage.removeItem(CACHE_EMP);
        sessionStorage.removeItem(CACHE_LIVROS);

        await Promise.all([
            carregarEmprestimos(),
            carregarDropdowns()
        ]);

    } catch (err) {
        alert("Erro ao conectar com o serviço de empréstimos.");
    }
}

// Utilitário

function formatarData(dataStr) {

    if (!dataStr) return "-";

    const [ano, mes, dia] = dataStr
        .split("T")[0]
        .split("-");

    return `${dia}/${mes}/${ano}`;
}

// Init

carregarEmprestimos();
carregarDropdowns();