from models.cliente_model import (
    get_all_clientes,
    get_cliente_by_id,
    get_cliente_by_email,
    create_cliente,
    update_cliente,
    possui_emprestimos_ativos,
    delete_cliente
)

from auth import (
    gerar_hash_senha,
    verificar_senha,
    gerar_token
)


def listar_clientes():
    return get_all_clientes()


def buscar_cliente(cliente_id):
    return get_cliente_by_id(cliente_id)


def adicionar_cliente(dados):
    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")
    matricula = dados.get("matricula")

    if not nome or not email or not senha:
        return {
            "erro": "nome, email e senha são obrigatórios"
        }, 400

    if get_cliente_by_email(email):
        return {
            "erro": "Email já cadastrado"
        }, 400

    senha_hash = gerar_hash_senha(senha)

    create_cliente(
        nome,
        email,
        senha_hash,
        matricula
    )

    return {
        "mensagem": "Cliente criado com sucesso"
    }, 201


def login_cliente(dados):
    email = dados.get("email")
    senha = dados.get("senha")

    if not email or not senha:
        return {
            "erro": "email e senha são obrigatórios"
        }, 400

    cliente = get_cliente_by_email(email)

    if not cliente:
        return {
            "erro": "Usuário não encontrado"
        }, 404

    if not verificar_senha(
        cliente["senha"],
        senha
    ):
        return {
            "erro": "Senha inválida"
        }, 401

    token = gerar_token(cliente["id"])

    return {
        "access_token": token,
        "user": {
            "id": cliente["id"],
            "nome": cliente["nome"],
            "email": cliente["email"],
            "role": "cliente"
        }
    }, 200


def editar_cliente(cliente_id, dados):
    nome = dados.get("nome")
    email = dados.get("email")
    matricula = dados.get("matricula")

    if not nome or not email:
        return {
            "erro": "nome e email são obrigatórios"
        }, 400

    if not get_cliente_by_id(cliente_id):
        return {
            "erro": "Cliente não encontrado"
        }, 404

    update_cliente(
        cliente_id,
        nome,
        email,
        matricula
    )

    return {
        "mensagem": "Cliente atualizado com sucesso"
    }, 200


def remover_cliente(cliente_id):
    if not get_cliente_by_id(cliente_id):
        return {
            "erro": "Cliente não encontrado"
        }, 404

    if possui_emprestimos_ativos(cliente_id):
        return {
            "erro": "Não é permitido excluir usuário com empréstimos ativos"
        }, 400

    delete_cliente(cliente_id)

    return {
        "mensagem": "Cliente removido com sucesso"
    }, 200