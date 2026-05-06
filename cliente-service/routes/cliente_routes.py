from flask import Blueprint, request, jsonify
from controllers.cliente_controller import listar_clientes, adicionar_cliente

cliente_bp = Blueprint("cliente", __name__)

@cliente_bp.route("/clientes", methods=["GET"])
def get_clientes():
    return jsonify(listar_clientes())


@cliente_bp.route("/clientes", methods=["POST"])
def post_cliente():
    data = request.json
    response = adicionar_cliente(data)

    return jsonify(response[0] if isinstance(response, tuple) else response), \
           response[1] if isinstance(response, tuple) else 200