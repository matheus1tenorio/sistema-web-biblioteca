from models.emprestimo_model import (
    get_all_emprestimos,
    create_emprestimo,
    finalizar_emprestimo
)

def listar_emprestimos():
    return get_all_emprestimos()


def criar_emprestimo(data):
    create_emprestimo(
        data["cliente_id"],
        data["livro_id"],
        data["data_emprestimo"]
    )


def devolver_livro(emprestimo_id, data):
    finalizar_emprestimo(
        emprestimo_id,
        data["data_devolucao"]
    )