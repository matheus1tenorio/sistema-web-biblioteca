from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from flask_jwt_extended import (
    create_access_token
)


def gerar_hash_senha(senha):
    return generate_password_hash(senha)


def verificar_senha(hash_senha, senha):
    return check_password_hash(
        hash_senha,
        senha
    )


def gerar_token(cliente_id, role='cliente'):
    return create_access_token(
        identity=str(cliente_id),
        additional_claims={'role': role}
    )