from pydantic import BaseModel


class LoginRequest(BaseModel):
    name: str
    password: str


class CustomerCreate(BaseModel):
    name: str
    password: str
    balance: float = 1000.00


class DepositRequest(BaseModel):
    amount: float


class WithdrawRequest(BaseModel):
    amount: float