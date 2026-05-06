from flask import Blueprint, request, jsonify
from controllers.livro_controller import *

livro_bp = Blueprint("livro_bp", __name__)


@livro_bp.route("/livros", methods=["GET"])
def listar():
    return jsonify(listar_livros()), 200


@livro_bp.route("/livros/<int:id>", methods=["GET"])
def buscar(id):
    livro = buscar_livro(id)

    if livro:
        return jsonify(livro), 200
    return jsonify({"erro": "Livro não encontrado"}), 404


@livro_bp.route("/livros", methods=["POST"])
def criar():
    data = request.json

    ok = criar_livro(data)

    if not ok:
        return jsonify({"erro": "Dados inválidos"}), 400

    return jsonify({"mensagem": "Livro criado com sucesso"}), 201


@livro_bp.route("/livros/<int:id>/status", methods=["PUT"])
def status(id):
    data = request.json

    if "disponivel" not in data:
        return jsonify({"erro": "Campo 'disponivel' obrigatório"}), 400

    alterar_status(id, data["disponivel"])
    return jsonify({"mensagem": "Status atualizado"}), 200