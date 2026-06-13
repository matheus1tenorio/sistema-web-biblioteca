import os
import requests
from datetime import datetime

from models.emprestimo_model import (
    get_all_emprestimos,
    get_emprestimo_by_id,
    create_emprestimo,
    finalizar_emprestimo,
    delete_emprestimo
)

LIVRO_SERVICE_URL = os.getenv(
    "LIVRO_SERVICE_URL",
    "http://livro-service:5000"
)

CLIENTE_SERVICE_URL = os.getenv(
    "CLIENTE_SERVICE_URL",
    "http://cliente-service:5000"
)


def listar_emprestimos():
    return get_all_emprestimos()


def criar_emprestimo(data):
    cliente_id = data.get("cliente_id")
    livro_id = data.get("livro_id")

    if not cliente_id or not livro_id:
        return {"erro": "cliente_id e livro_id são obrigatórios"}, 400

    data_emprestimo = datetime.now().date().isoformat()

    try:
        resp_cliente = requests.get(
            f"{CLIENTE_SERVICE_URL}/clientes/{cliente_id}",
            timeout=5
        )

        if resp_cliente.status_code == 404:
            return {"erro": "Cliente não encontrado"}, 404

        resp_livro = requests.get(
            f"{LIVRO_SERVICE_URL}/livros/{livro_id}",
            timeout=5
        )

        if resp_livro.status_code == 404:
            return {"erro": "Livro não encontrado"}, 404

        livro = resp_livro.json()

        if livro["quantidade"] <= 0:
            return {
                "erro": "Livro sem exemplares disponíveis"
            }, 400

    except requests.exceptions.RequestException as e:
        return {
            "erro": f"Erro ao validar cliente ou livro: {str(e)}"
        }, 500

    create_emprestimo(
        cliente_id,
        livro_id,
        data_emprestimo
    )

    try:
        requests.put(
            f"{LIVRO_SERVICE_URL}/livros/{livro_id}/reduzir",
            timeout=5
        )
    except requests.exceptions.RequestException:
        pass

    return {"mensagem": "Empréstimo criado com sucesso"}, 201


def devolver_livro(emprestimo_id, data):
    data_devolucao = data.get("data_devolucao")

    if not data_devolucao:
        return {"erro": "data_devolucao é obrigatória"}, 400

    emprestimo = get_emprestimo_by_id(emprestimo_id)

    if not emprestimo:
        return {"erro": "Empréstimo não encontrado"}, 404

    if emprestimo.get("data_devolucao"):
        return {"erro": "Este livro já foi devolvido"}, 400

    finalizar_emprestimo(
        emprestimo_id,
        data_devolucao
    )

    try:
        requests.put(
            f"{LIVRO_SERVICE_URL}/livros/{emprestimo['livro_id']}/aumentar",
            timeout=5
        )
    except requests.exceptions.RequestException:
        pass

    return {"mensagem": "Livro devolvido com sucesso"}, 200


def remover_emprestimo(emprestimo_id):
    emprestimo = get_emprestimo_by_id(emprestimo_id)

    if not emprestimo:
        return {"erro": "Empréstimo não encontrado"}, 404

    if not emprestimo.get("data_devolucao"):
        try:
            requests.put(
                f"{LIVRO_SERVICE_URL}/livros/{emprestimo['livro_id']}/aumentar",
                timeout=5
            )
        except requests.exceptions.RequestException:
            pass

    delete_emprestimo(emprestimo_id)

    return {"mensagem": "Empréstimo removido com sucesso"}, 200