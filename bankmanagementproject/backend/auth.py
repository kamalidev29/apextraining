from database import get_connection


def admin_login(name, password):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT id, name
        FROM admins
        WHERE name = %s AND password = %s
    """

    cursor.execute(query, (name, password))
    admin = cursor.fetchone()

    cursor.close()
    connection.close()

    return admin


def customer_login(name, password):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT id, name, balance
        FROM customers
        WHERE name = %s AND password = %s
    """

    cursor.execute(query, (name, password))
    customer = cursor.fetchone()

    cursor.close()
    connection.close()

    return customer