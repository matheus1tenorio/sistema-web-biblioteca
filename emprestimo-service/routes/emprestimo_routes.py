from flask import Blueprint, request, jsonify
from controllers.emprestimo_controller import *

emprestimo_bp = Blueprint("emprestimo_bp", __name__)

@emprestimo_bp.route("/emprestimos", methods=["GET"])
def listar():
    return jsonify(listar_emprestimos()), 200


@emprestimo_bp.route("/emprestimos", methods=["POST"])
def criar():
    data = request.json

    criar_emprestimo(data)

    return jsonify({
        "mensagem": "Emprestimo criado com sucesso"
    }), 201


@emprestimo_bp.route("/emprestimos/<int:id>/devolver", methods=["PUT"])
def devolver(id):
    data = request.json

    devolver_livro(id, data)

    return jsonify({
        "mensagem": "Livro devolvido com sucesso"
    }), 200