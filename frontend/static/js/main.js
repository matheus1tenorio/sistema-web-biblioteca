// Aguarda o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema de Biblioteca: Frontend pronto.");

    // 1. Lógica para Captura de Formulários (Create/Update)
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            console.log("Processando:", data); // Mantemos no console para conferência técnica

            // Identifica qual formulário está sendo enviado para mostrar a mensagem certa
            let mensagem = "Operação realizada com sucesso!";
            
            if (form.id === 'livro-form') mensagem = "Livro cadastrado com sucesso!";
            if (form.id === 'usuario-form') mensagem = "Usuário cadastrado com sucesso!";
            if (form.id === 'emprestimo-form') mensagem = "Empréstimo realizado com sucesso!";

            alert(mensagem);
            form.reset();
        });
    });

    // 2. Lógica para Botões de Exclusão (Delete)
    // Usamos delegação de eventos para funcionar com elementos estáticos e dinâmicos
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const confirmar = confirm("Tem certeza que deseja excluir este registro?");
            
            if (confirmar) {
                // Futuramente: chamada DELETE ao backend
                const linha = e.target.closest('tr');
                if (linha) {
                    linha.remove();
                    alert("Registro removido (simulação).");
                }
            }
        }
    });

    // 3. Lógica para Devolução (Específico de Empréstimos)
    document.addEventListener('click', (e) => {
        if (e.target.innerText === 'Devolver') {
            alert("Livro devolvido com sucesso!");
            const statusCell = e.target.closest('tr').querySelector('td:nth-child(4)');
            if (statusCell) statusCell.innerText = 'Devolvido';
            e.target.disabled = true;
            e.target.style.backgroundColor = '#bdc3c7';
        }
    });
});