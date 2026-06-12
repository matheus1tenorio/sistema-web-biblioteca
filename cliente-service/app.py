from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from routes.cliente_routes import cliente_bp


app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "biblioteca_secret_key"

jwt = JWTManager(app)

CORS(app)

app.register_blueprint(cliente_bp)


@app.route("/")
def home():
    return {"mensagem": "Cliente Service rodando"}


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )