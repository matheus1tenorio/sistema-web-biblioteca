from models.livro_model import (
    get_all_livros,
    get_livro_by_id,
    create_livro,
    update_disponibilidade
)

def listar_livros():
    return get_all_livros()


def buscar_livro(livro_id):
    return get_livro_by_id(livro_id)


def criar_livro(data):
    if "titulo" not in data or "autor" not in data:
        return None

    create_livro(data["titulo"], data["autor"])
    return True


def alterar_status(livro_id, disponivel):
    update_disponibilidade(livro_id, disponivel)
    return True