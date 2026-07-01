from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from controllers.emprestimo_controller import (
    listar_emprestimos,
    criar_emprestimo,
    devolver_livro,
    remover_emprestimo
)

emprestimo_bp = Blueprint("emprestimo_bp", __name__)


@emprestimo_bp.route("/emprestimos", methods=["GET"])
def listar():
    return jsonify(listar_emprestimos()), 200


@emprestimo_bp.route("/emprestimos", methods=["POST"])
@jwt_required()
def criar():
    data = request.json
    claims = get_jwt()
    role = claims.get("role", "cliente")
    usuario_id = int(get_jwt_identity())

    # Cliente comum só pode pedir empréstimo pra si mesmo.
    # Admin pode registrar empréstimo em nome de qualquer cliente.
    if role != "admin":
        if not data:
            data = {}
        if data.get("cliente_id") and int(data["cliente_id"]) != usuario_id:
            return jsonify({
                "erro": "Você só pode solicitar empréstimos para si mesmo"
            }), 403

        data["cliente_id"] = usuario_id

    resultado = criar_emprestimo(data)
    return jsonify(resultado[0]), resultado[1]


@emprestimo_bp.route("/emprestimos/<int:id>/devolver", methods=["PUT"])
def devolver(id):
    data = request.json
    resultado = devolver_livro(id, data)
    return jsonify(resultado[0]), resultado[1]


@emprestimo_bp.route("/emprestimos/<int:id>", methods=["DELETE"])
def excluir(id):
    resultado = remover_emprestimo(id)
    return jsonify(resultado[0]), resultado[1]