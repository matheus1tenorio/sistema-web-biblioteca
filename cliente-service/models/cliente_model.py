from config import get_connection

def get_all_clientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM cliente")
    result = cursor.fetchall()

    conn.close()
    return result


def create_cliente(nome, email):
    conn = get_connection()
    cursor = conn.cursor()

    sql = "INSERT INTO cliente (nome, email) VALUES (%s, %s)"
    cursor.execute(sql, (nome, email))

    conn.commit()
    conn.close()