from database import get_connection


# ==========================================================
# GET ALL CUSTOMERS
# ==========================================================

def get_all_customers():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, name, password, balance
        FROM customers
    """)

    customers = cursor.fetchall()

    cursor.close()
    connection.close()

    return customers


# ==========================================================
# GET ONE CUSTOMER
# ==========================================================

def get_customer(customer_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, name, password, balance
        FROM customers
        WHERE id = %s
    """, (customer_id,))

    customer = cursor.fetchone()

    cursor.close()
    connection.close()

    return customer


# ==========================================================
# CREATE CUSTOMER
# ==========================================================

def create_customer(name, password, balance=1000.00):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        INSERT INTO customers (name, password, balance)
        VALUES (%s, %s, %s)
    """, (name, password, balance))

    connection.commit()

    customer_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return get_customer(customer_id)


# ==========================================================
# DELETE CUSTOMER
# ==========================================================

def delete_customer(customer_id):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM customers
        WHERE id = %s
    """, (customer_id,))

    connection.commit()

    deleted = cursor.rowcount > 0

    cursor.close()
    connection.close()

    return deleted


# ==========================================================
# DEPOSIT
# ==========================================================

def deposit_money(customer_id, amount):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE customers
        SET balance = balance + %s
        WHERE id = %s
    """, (amount, customer_id))

    connection.commit()

    updated = cursor.rowcount > 0

    cursor.close()
    connection.close()

    if updated:
        return get_customer(customer_id)

    return None


# ==========================================================
# WITHDRAW
# ==========================================================

def withdraw_money(customer_id, amount):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT balance
        FROM customers
        WHERE id = %s
    """, (customer_id,))

    customer = cursor.fetchone()

    if customer is None:
        cursor.close()
        connection.close()
        return None

    current_balance = float(customer[0])

    if amount > current_balance:
        cursor.close()
        connection.close()
        return "INSUFFICIENT_BALANCE"

    cursor.execute("""
        UPDATE customers
        SET balance = balance - %s
        WHERE id = %s
    """, (amount, customer_id))

    connection.commit()

    cursor.close()
    connection.close()

    return get_customer(customer_id)