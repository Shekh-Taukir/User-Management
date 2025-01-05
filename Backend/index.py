from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.user_router import user_router
from db.db_init import Base, engine

app = FastAPI()

app.include_router(user_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
