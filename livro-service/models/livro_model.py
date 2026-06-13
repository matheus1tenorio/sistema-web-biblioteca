from config import get_connection


def get_all_livros():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM livro")
    livros = cursor.fetchall()

    conn.close()

    for livro in livros:
        livro["disponivel"] = bool(livro["disponivel"])

    return livros


def get_livro_by_id(livro_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM livro WHERE id = %s",
        (livro_id,)
    )

    livro = cursor.fetchone()

    conn.close()

    if livro:
        livro["disponivel"] = bool(livro["disponivel"])

    return livro


def create_livro(titulo, autor, ano=None, quantidade=1):
    conn = get_connection()
    cursor = conn.cursor()

    disponivel = quantidade > 0

    cursor.execute(
        """
        INSERT INTO livro
        (titulo, autor, ano, quantidade, disponivel)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (titulo, autor, ano, quantidade, disponivel)
    )

    conn.commit()
    conn.close()


def update_livro(livro_id, titulo, autor, ano=None, quantidade=1):
    conn = get_connection()
    cursor = conn.cursor()

    disponivel = quantidade > 0

    cursor.execute(
        """
        UPDATE livro
        SET titulo = %s,
            autor = %s,
            ano = %s,
            quantidade = %s,
            disponivel = %s
        WHERE id = %s
        """,
        (titulo, autor, ano, quantidade, disponivel, livro_id)
    )

    conn.commit()
    conn.close()


def update_disponibilidade(livro_id, disponivel):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE livro SET disponivel = %s WHERE id = %s",
        (disponivel, livro_id)
    )

    conn.commit()
    conn.close()


def reduzir_estoque(livro_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT quantidade FROM livro WHERE id = %s",
        (livro_id,)
    )

    livro = cursor.fetchone()

    if not livro or livro["quantidade"] <= 0:
        conn.close()
        return False

    nova_quantidade = livro["quantidade"] - 1
    disponivel = nova_quantidade > 0

    cursor.execute(
        """
        UPDATE livro
        SET quantidade = %s,
            disponivel = %s
        WHERE id = %s
        """,
        (nova_quantidade, disponivel, livro_id)
    )

    conn.commit()
    conn.close()

    return True


def aumentar_estoque(livro_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT quantidade FROM livro WHERE id = %s",
        (livro_id,)
    )

    livro = cursor.fetchone()

    if not livro:
        conn.close()
        return False

    nova_quantidade = livro["quantidade"] + 1

    cursor.execute(
        """
        UPDATE livro
        SET quantidade = %s,
            disponivel = TRUE
        WHERE id = %s
        """,
        (nova_quantidade, livro_id)
    )

    conn.commit()
    conn.close()

    return True


def possui_emprestimos_ativos(livro_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT COUNT(*) AS total
        FROM emprestimo
        WHERE livro_id = %s
        AND data_devolucao IS NULL
        """,
        (livro_id,)
    )

    resultado = cursor.fetchone()

    conn.close()

    return resultado["total"] > 0


def delete_livro(livro_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM livro WHERE id = %s",
        (livro_id,)
    )

    conn.commit()
    conn.close()