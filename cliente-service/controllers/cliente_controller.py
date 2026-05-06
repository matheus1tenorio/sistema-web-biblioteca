from models.cliente_model import get_all_clientes, create_cliente

def listar_clientes():
    return get_all_clientes()


def adicionar_cliente(dados):
    nome = dados.get("nome")
    email = dados.get("email")

    if not nome or not email:
        return {"erro": "nome e email obrigatórios"}, 400

    create_cliente(nome, email)
    return {"mensagem": "Cliente criado com sucesso"}, 201