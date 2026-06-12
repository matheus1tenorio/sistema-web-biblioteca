from flask import Blueprint, request, jsonify

from controllers.cliente_controller import (
    listar_clientes,
    buscar_cliente,
    adicionar_cliente,
    editar_cliente,
    remover_cliente,
    login_cliente
)

from flask_jwt_extended import jwt_required


cliente_bp = Blueprint("cliente", __name__)


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
@jwt_required()
def put_cliente(id):
    data = request.json

    resultado = editar_cliente(id, data)

    return jsonify(resultado[0]), resultado[1]


@cliente_bp.route("/clientes/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_cliente_route(id):
    resultado = remover_cliente(id)

    return jsonify(resultado[0]), resultado[1]