from config import get_connection

def get_all_emprestimos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM emprestimo
    """)

    emprestimos = cursor.fetchall()

    conn.close()
    return emprestimos


def create_emprestimo(cliente_id, livro_id, data_emprestimo):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO emprestimo
        (cliente_id, livro_id, data_emprestimo)
        VALUES (%s, %s, %s)
    """, (cliente_id, livro_id, data_emprestimo))

    conn.commit()
    conn.close()


def finalizar_emprestimo(emprestimo_id, data_devolucao):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE emprestimo
        SET data_devolucao = %s
        WHERE id = %s
    """, (data_devolucao, emprestimo_id))

    conn.commit()
    conn.close()