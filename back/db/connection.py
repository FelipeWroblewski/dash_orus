import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def connect_dw():
    print(os.getenv("DW_HOST"))
    try:
        conn = psycopg2.connect(
            database = os.getenv("DW_NAME"),
            user = os.getenv("DW_USER"),
            host = os.getenv("DW_HOST"),
            password = os.getenv("DW_PASS"),
            port = os.getenv("DW_PORT")
        )
        print("Conexão com o banco de dados estabelecidade com sucesso")
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        return None
    return conn

def disconnect(conn):
    if conn:
        conn.close()
        print("Conexão com o banco de dados encerrada")
    else:
        print("Nenhuma conxão ativa para encerrar")