const API_LIVROS = "/api/livros";
let editandoId = null;

//  Carregar e renderizar tabela 

async function carregarLivros() {
    const tbody = document.getElementById("tabela-livros-body");

    try {
        const response = await authenticatedFetch(API_LIVROS);

        if (!response.ok) {
            throw new Error("Erro ao carregar livros");
        }

        const livros = await response.json();

        tbody.innerHTML = "";

        if (!livros.length) {
            tbody.innerHTML =
                '<tr><td colspan="6" style="text-align:center">Nenhum livro cadastrado.</td></tr>';
            return;
        }

        const admin = isAdmin();

        livros.forEach(l => {
            tbody.innerHTML += `
                <tr>
                    <td>${l.titulo}</td>
                    <td>${l.autor}</td>
                    <td>${l.ano || "-"}</td>
                    <td>${l.quantidade}</td>
                    <td>${l.disponivel ? "✅ Disponível" : "❌ Indisponível"}</td>
                    <td>
                        ${admin ? `
                            <button onclick="prepararEdicao(
                                ${l.id},
                                '${esc(l.titulo)}',
                                '${esc(l.autor)}',
                                ${l.ano || "null"},
                                ${l.quantidade}
                            )">Editar</button>
                            <button onclick="deletarLivro(${l.id})" style="background:#e74c3c">Excluir</button>
                        ` : `<span style="color:#888">Somente leitura</span>`}
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error("Erro ao carregar livros:", err);
        tbody.innerHTML =
            '<tr><td colspan="6" style="color:red;text-align:center">Erro ao conectar com o serviço de livros.</td></tr>';
    }
}

// Salvar (criar ou atualizar) 

document.getElementById("livro-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isAdmin()) {
        alert("Apenas administradores podem realizar esta ação.");
        return;
    }

    const dados = {
        titulo:     e.target.titulo.value.trim(),
        autor:      e.target.autor.value.trim(),
        ano:        e.target.ano.value ? parseInt(e.target.ano.value) : null,
        quantidade: e.target.quantidade.value ? parseInt(e.target.quantidade.value) : 0
    };

    const url    = editandoId ? `${API_LIVROS}/${editandoId}` : API_LIVROS;
    const metodo = editandoId ? "PUT" : "POST";

    try {
        const response = await authenticatedFetch(url, {
            method: metodo,
            body: JSON.stringify(dados)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro || "Erro ao salvar livro.");
            return;
        }

        cancelarEdicao();
        carregarLivros();

    } catch (err) {
        alert("Erro ao conectar com o serviço de livros.");
    }
});

// Preparar edição 

function prepararEdicao(id, titulo, autor, ano, quantidade) {
    if (!isAdmin()) {
        alert("Apenas administradores podem editar livros.");
        return;
    }

    editandoId = id;

    const form = document.getElementById("livro-form");
    form.titulo.value     = titulo;
    form.autor.value      = autor;
    form.ano.value        = ano !== null ? ano : "";
    form.quantidade.value = quantidade;

    document.getElementById("form-titulo").innerText       = "Editar Livro";
    document.getElementById("btn-salvar").innerText        = "Atualizar Livro";
    document.getElementById("btn-cancelar").style.display = "inline-block";

    form.scrollIntoView({ behavior: "smooth" });
}

function cancelarEdicao() {
    editandoId = null;

    document.getElementById("livro-form").reset();
    document.getElementById("quantidade").value = 1;

    document.getElementById("form-titulo").innerText       = "Cadastrar Novo Livro";
    document.getElementById("btn-salvar").innerText        = "Salvar Livro";
    document.getElementById("btn-cancelar").style.display = "none";
}

// Excluir 

async function deletarLivro(id) {
    if (!isAdmin()) {
        alert("Apenas administradores podem excluir livros.");
        return;
    }

    if (!confirm("Tem certeza que deseja excluir este livro?")) return;

    try {
        const response = await authenticatedFetch(`${API_LIVROS}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro || "Erro ao excluir livro.");
            return;
        }

        carregarLivros();

    } catch (err) {
        alert("Erro ao conectar com o serviço de livros.");
    }
}

// Utilitário 

function esc(str) {
    return String(str || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}

// Init 

carregarLivros();