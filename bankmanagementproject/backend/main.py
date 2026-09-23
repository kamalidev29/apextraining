from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    LoginRequest,
    CustomerCreate,
    DepositRequest,
    WithdrawRequest
)

from auth import admin_login, customer_login

from crud import (
    get_all_customers,
    get_customer,
    create_customer,
    delete_customer,
    deposit_money,
    withdraw_money
)


# ==========================================================
# CREATE FASTAPI APP
# ==========================================================

app = FastAPI(
    title="Bank Management System API",
    description="FastAPI backend for Bank Management System",
    version="1.0.0"
)


# ==========================================================
# CORS CONFIGURATION
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# HOME
# ==========================================================

@app.get("/")
def home():
    return {
        "message": "Bank Management System API is running"
    }


# ==========================================================
# ADMIN LOGIN
# ==========================================================

@app.post("/admin/login")
def admin_login_api(login: LoginRequest):

    admin = admin_login(
        login.name,
        login.password
    )

    if admin is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin name or password"
        )

    return {
        "message": "Admin login successful",
        "admin": admin
    }


# ==========================================================
# CUSTOMER LOGIN
# ==========================================================

@app.post("/customer/login")
def customer_login_api(login: LoginRequest):

    customer = customer_login(
        login.name,
        login.password
    )

    if customer is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid customer name or password"
        )

    return {
        "message": "Customer login successful",
        "customer": customer
    }


# ==========================================================
# GET ALL CUSTOMERS
# ==========================================================

@app.get("/customers")
def get_customers():

    return get_all_customers()


# ==========================================================
# GET ONE CUSTOMER
# ==========================================================

@app.get("/customers/{customer_id}")
def get_one_customer(customer_id: int):

    customer = get_customer(customer_id)

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


# ==========================================================
# CREATE CUSTOMER
# ==========================================================

@app.post("/customers")
def add_customer(customer: CustomerCreate):

    new_customer = create_customer(
        customer.name,
        customer.password,
        customer.balance
    )

    return {
        "message": "Customer created successfully",
        "customer": new_customer
    }


# ==========================================================
# DELETE CUSTOMER
# ==========================================================

@app.delete("/customers/{customer_id}")
def remove_customer(customer_id: int):

    deleted = delete_customer(customer_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return {
        "message": "Customer deleted successfully"
    }


# ==========================================================
# DEPOSIT MONEY
# ==========================================================

@app.put("/customers/{customer_id}/deposit")
def deposit(
    customer_id: int,
    request: DepositRequest
):

    # Check amount
    if request.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Deposit amount must be greater than 0"
        )

    # Deposit money
    customer = deposit_money(
        customer_id,
        request.amount
    )

    # Customer not found
    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return {
        "message": "Amount deposited successfully",
        "customer": customer
    }


# ==========================================================
# WITHDRAW MONEY
# ==========================================================

@app.put("/customers/{customer_id}/withdraw")
def withdraw(
    customer_id: int,
    request: WithdrawRequest
):

    # Check amount
    if request.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Withdrawal amount must be greater than 0"
        )

    # Withdraw money
    customer = withdraw_money(
        customer_id,
        request.amount
    )

    # Customer not found
    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # Insufficient balance
    if customer == "INSUFFICIENT_BALANCE":
        raise HTTPException(
            status_code=400,
            detail="Insufficient balance"
        )

    return {
        "message": "Amount withdrawn successfully",
        "customer": customer
    }