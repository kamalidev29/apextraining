from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
#Welcome

@app.get("/home_items")
def read_root():
    return {"Hello": "World"}


class User(BaseModel):
    name: str
    age: int


# POST
@app.post("/user")
def create_user(user: User):
    return {
        "message": "User created successfully",
        "name": user.name,
        "age": user.age
    }


# PUT
@app.put("/user/{user_id}")
def update_user(user_id: int, user: User):
    return {
        "message": "User updated successfully",
        "user_id": user_id,
        "name": user.name,
        "age": user.age
    }


# DELETE
@app.delete("/user/{user_id}")
def delete_user(user_id: int):
    return {
        "message": "User deleted successfully",
        "user_id": user_id
    }