from pydantic import BaseModel
from typing import Optional


class Admin(BaseModel):
    id: int
    name: str
    password: str


class Customer(BaseModel):
    id: int
    name: str
    password: str
    balance: float


class CustomerCreate(BaseModel):
    name: str
    password: str
    balance: Optional[float] = 1000.00


class LoginRequest(BaseModel):
    name: str
    password: str


class DepositRequest(BaseModel):
    amount: float


class WithdrawRequest(BaseModel):
    amount: float