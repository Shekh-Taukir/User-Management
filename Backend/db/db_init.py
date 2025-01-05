from fastapi import Depends
from typing import Annotated
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base

"""
Note for db: I have been using postgres db as the db for this project, and the name of database which we connect in postgres sql is postgres
"""

db_url = "postgresql://postgres:admin@localhost:5432/postgres"

engine = create_engine(db_url)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=True,
)

Base = declarative_base()


def of_get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(of_get_db)]
