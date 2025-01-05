from db.db_init import Base
from sqlalchemy import String, Integer, DATE, text, Column


class User(Base):
    __tablename__ = "user_mst_fs"

    tran_id = Column(Integer, primary_key=True)
    first_name = Column(String, index=True)
    last_name = Column(String)
    email = Column(String)
    dob = Column(DATE)

    def __str__(self):
        return "Object is " + self.first_name + ", " + self.last_name
