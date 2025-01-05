from pydantic import BaseModel
from datetime import date


# (Jan 04, 2025 Taukir Python Project) - removed the tran_id line, as when we call API from frontend, then it should exactly match with the result set of form(as i was trying to call for html form), else will give error : 422 Unprocessable entity
class UserModel(BaseModel):
    first_name: str
    last_name: str
    email: str
    dob: date
