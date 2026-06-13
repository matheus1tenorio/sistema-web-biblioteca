from config import get_connection


def get_all_clientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM cliente")

    result = cursor.fetchall()

    conn.close()

    return result


def get_cliente_by_id(cliente_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM cliente WHERE id = %s",
        (cliente_id,)
    )

    result = cursor.fetchone()

    conn.close()

    return result


def get_cliente_by_email(email):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM cliente WHERE email = %s",
        (email,)
    )

    result = cursor.fetchone()

    conn.close()

    return result


def create_cliente(nome, email, senha, matricula=None):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO cliente
        (nome, email, matricula, senha)
        VALUES (%s, %s, %s, %s)
        """,
        (nome, email, matricula, senha)
    )

    conn.commit()

    conn.close()


def update_cliente(cliente_id, nome, email, matricula=None):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE cliente
        SET nome = %s,
            email = %s,
            matricula = %s
        WHERE id = %s
        """,
        (nome, email, matricula, cliente_id)
    )

    conn.commit()

    conn.close()


def possui_emprestimos_ativos(cliente_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT COUNT(*) AS total
        FROM emprestimo
        WHERE cliente_id = %s
        AND data_devolucao IS NULL
        """,
        (cliente_id,)
    )

    resultado = cursor.fetchone()

    conn.close()

    return resultado["total"] > 0


def delete_cliente(cliente_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM cliente WHERE id = %s",
        (cliente_id,)
    )

    conn.commit()

    conn.close()