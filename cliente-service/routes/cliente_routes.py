from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from functools import wraps

from controllers.cliente_controller import (
    listar_clientes,
    buscar_cliente,
    adicionar_cliente,
    editar_cliente,
    remover_cliente,
    login_cliente
)


cliente_bp = Blueprint("cliente", __name__)


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        role = claims.get("role", "cliente")

        if role != "admin":
            return jsonify({"erro": "Acesso restrito a administradores"}), 403

        return fn(*args, **kwargs)

    return wrapper


@cliente_bp.route("/clientes/login", methods=["POST"])
def login():
    data = request.json
    resultado = login_cliente(data)
    return jsonify(resultado[0]), resultado[1]


@cliente_bp.route("/clientes", methods=["GET"])
@jwt_required()
def get_clientes():
    return jsonify(listar_clientes()), 200


@cliente_bp.route("/clientes/<int:id>", methods=["GET"])
@jwt_required()
def get_cliente(id):
    cliente = buscar_cliente(id)

    if cliente:
        return jsonify(cliente), 200

    return jsonify({"erro": "Cliente não encontrado"}), 404


@cliente_bp.route("/clientes", methods=["POST"])
def post_cliente():
    data = request.json
    resultado = adicionar_cliente(data)
    return jsonify(resultado[0]), resultado[1]


@cliente_bp.route("/clientes/<int:id>", methods=["PUT"])
@admin_required
def put_cliente(id):
    data = request.json
    resultado = editar_cliente(id, data)
    return jsonify(resultado[0]), resultado[1]


@cliente_bp.route("/clientes/<int:id>", methods=["DELETE"])
@admin_required
def delete_cliente_route(id):
    resultado = remover_cliente(id)
    return jsonify(resultado[0]), resultado[1]