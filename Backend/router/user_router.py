from fastapi import APIRouter
from datetime import date
from db.models import User
from db.schema import UserModel, BaseModel
from db.db_init import db_dependency


class FormData(BaseModel):
    tran_id: int
    name: str
    email: str


user_router = APIRouter(
    prefix="/users",
    tags=["User"],
)


# basic check upi, to populate data in the html text
@user_router.get("/")
async def of_root():
    return {"Success": True, "Message": "Basic check API"}


# api that populates the data in the html table
@user_router.get("/test2")
async def of_test2():
    ls_msg = []
    for i in range(5):
        ls_msg.append(f"hello {i}")

    return {
        "Success": True,
        "result": {
            "value_1": ls_msg,
            "value_2": "taukir",
        },
    }


# --------------------------------------Main APIS-------------------------------------
# api to add a new user
@user_router.post("/add_user")
async def of_add_user(new_user: UserModel, db: db_dependency):
    print("here is the object that is came from html file")
    # print(new_user)
    if not new_user.first_name or not new_user.last_name:
        return {
            "Success": False,
            "Message": "user with empty firstname / lastname is not allowed.",
        }

    db_user = User(
        first_name=new_user.first_name,
        last_name=new_user.last_name,
        email=new_user.email,
        dob=new_user.dob,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {
        "Success": True,
        "user added: ": db_user,
    }


# api to get all the users
@user_router.get("/get_all_users")
async def of_get_users(db: db_dependency):
    db_users = db.query(User).order_by(User.tran_id.desc()).all()
    if len(db_users) <= 0:
        return {
            "Success": False,
            "Message": "no data found for users.",
        }
    else:
        return {
            "Success": True,
            "result": db_users,
            "row_count": len(db_users),
        }


@user_router.get("/get_user")
async def of_get_user(user_id: int, db: db_dependency):
    if not user_id or user_id <= 0:
        return {
            "Success": False,
            "Message": "Invalid user_id.",
        }

    user = db.query(User).filter(User.tran_id == user_id).first()

    if not user:
        return {
            "Success": False,
            "Message": "user not found.",
        }

    return {
        "Success": True,
        "result": user,
    }


@user_router.put("/update_user")    
async def of_update_user(user_id: int, user: UserModel, db: db_dependency):
    if not user_id or user_id <= 0:
        return {
            "Success": False,
            "Message": "Invalid user_id.",
        }

    if not user:
        return {
            "Success": False,
            "Message": "invalid user input data.",
        }

    og_user = db.query(User).filter(User.tran_id == user_id).first()

    if not og_user:
        return {
            "Success": False,
            "Message": "invalid user data as per user_id.",
        }

    og_user.first_name = user.first_name  # type: ignore
    og_user.last_name = user.last_name  # type: ignore
    og_user.email = user.email  # type: ignore
    og_user.dob = user.dob  # type: ignore

    db.commit()
    db.refresh(og_user)

    return {
        "Success": True,
        "updated_user": og_user,
    }


# Delete API
@user_router.delete("/delete_user")
async def of_delete_user(user_id: int, db: db_dependency):
    if not user_id or user_id <= 0:
        return {
            "Success": False,
            "Message": "Invalid user_id.",
        }

    user = db.query(User).filter(User.tran_id == user_id).first()

    if not user:
        return {
            "Success": False,
            "Message": "invalid user data as per user_id.",
        }

    db.delete(user)
    db.commit()

    return {
        "Success": True,
        "deleted_user": user,
    }


@user_router.post("/test_add_api")
async def of_get_update_data(user_id: int, data_list: list, db: db_dependency):
    print("This is the input from the API : ")
    print(data_list)


@user_router.post("/test_submit")
async def of_submit_test(data: FormData):
    print("User inputed :")
    print(f"Email : {data.email} and name : {data.name}")
    return {"value": data, "Message": "value fetched"}
