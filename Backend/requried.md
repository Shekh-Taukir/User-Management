FastAPI Backend Setup Guide (Windows)

To set up and run your FastAPI backend server, follow these steps:

1. Create a Virtual Environment for Python
   Run the following command to create a virtual environment:
   python -m venv env

   After creating the virtual environment, activate it by running:
   .\env\Scripts\activate

2. Install Required Libraries
   With the virtual environment activated, install all necessary libraries using this command:
   pip install fastapi pydantic psycopg2 sqlalchemy uvicorn

3. Run the Backend Serverk
   After installing the required libraries, use the following command to start your FastAPI backend server:
   uvicorn index:app --reload
   - `index` is the name of your Python file (e.g., `index.py`).
   - `app` is the FastAPI application instance defined in the file.
   - `--reload` enables auto-reloading of the server when you make code changes.
