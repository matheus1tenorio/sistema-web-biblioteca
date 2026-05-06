from config import get_connection

def get_all_livros():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM livro")
    livros = cursor.fetchall()

    conn.close()
    return livros


def get_livro_by_id(livro_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM livro WHERE id = %s", (livro_id,))
    livro = cursor.fetchone()

    conn.close()
    return livro


def create_livro(titulo, autor):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO livro (titulo, autor, disponivel) VALUES (%s, %s, %s)",
        (titulo, autor, True)
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