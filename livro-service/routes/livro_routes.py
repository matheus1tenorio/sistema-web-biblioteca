from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests

from controllers.livro_controller import (
    listar_livros,
    buscar_livro,
    criar_livro,
    editar_livro,
    alterar_status,
    diminuir_estoque_livro,
    aumentar_estoque_livro,
    remover_livro
)

livro_bp = Blueprint("livro_bp", __name__)

CLIENTE_SERVICE_URL = "http://cliente-service:5000"


def buscar_cliente(user_id):
    try:
        token = request.headers.get("Authorization")
        headers = {"Authorization": token} if token else {}

        resp = requests.get(
            f"{CLIENTE_SERVICE_URL}/clientes/{user_id}",
            headers=headers,
            timeout=5
        )

        if resp.status_code == 200:
            return resp.json()

        return None

    except requests.exceptions.RequestException:
        return None


def verificar_admin():
    user_id = get_jwt_identity()
    usuario = buscar_cliente(user_id)

    if not usuario or usuario.get("role") != "admin":
        return False

    return True


@livro_bp.route("/livros", methods=["GET"])
@jwt_required()
def listar():
    return jsonify(listar_livros()), 200


@livro_bp.route("/livros/<int:id>", methods=["GET"])
@jwt_required()
def buscar(id):
    livro = buscar_livro(id)

    if livro:
        return jsonify(livro), 200

    return jsonify({"erro": "Livro não encontrado"}), 404


@livro_bp.route("/livros", methods=["POST"])
@jwt_required()
def criar():
    if not verificar_admin():
        return jsonify({"erro": "Apenas administradores podem cadastrar livros"}), 403

    data = request.json
    resultado = criar_livro(data)

    return jsonify(resultado[0]), resultado[1]


@livro_bp.route("/livros/<int:id>", methods=["PUT"])
@jwt_required()
def editar(id):
    if not verificar_admin():
        return jsonify({"erro": "Apenas administradores podem editar livros"}), 403

    data = request.json
    resultado = editar_livro(id, data)

    return jsonify(resultado[0]), resultado[1]


@livro_bp.route("/livros/<int:id>/status", methods=["PUT"])
@jwt_required()
def status(id):
    if not verificar_admin():
        return jsonify({"erro": "Apenas administradores podem alterar status"}), 403

    data = request.json

    if "disponivel" not in data:
        return jsonify({"erro": "Campo 'disponivel' obrigatório"}), 400

    alterar_status(id, data["disponivel"])

    return jsonify({"mensagem": "Status atualizado"}), 200


@livro_bp.route("/livros/<int:id>/reduzir", methods=["PUT"])
@jwt_required()
def reduzir(id):
    resultado = diminuir_estoque_livro(id)
    return jsonify(resultado[0]), resultado[1]


@livro_bp.route("/livros/<int:id>/aumentar", methods=["PUT"])
@jwt_required()
def aumentar(id):
    resultado = aumentar_estoque_livro(id)
    return jsonify(resultado[0]), resultado[1]


@livro_bp.route("/livros/<int:id>", methods=["DELETE"])
@jwt_required()
def excluir(id):
    if not verificar_admin():
        return jsonify({"erro": "Apenas administradores podem remover livros"}), 403

    resultado = remover_livro(id)
    return jsonify(resultado[0]), resultado[1]