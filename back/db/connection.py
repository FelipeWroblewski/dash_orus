from pathlib import Path
import psycopg2
import os
from dotenv import load_dotenv


def connect_dw():
    from pathlib import Path
    env_path = Path(__file__).resolve().parent.parent / ".env"
    load_dotenv(dotenv_path=env_path)

    host = os.getenv("DW_HOST")
    print(os.getenv("DW_HOST"))

    print(f"Tentando conectar em: {host}")  # para debugar

    if not host:
        raise EnvironmentError("Variáveis de ambiente do banco não encontradas. Verifique o .env")    

    try:
        conn = psycopg2.connect(
            database = os.getenv("DW_NAME"),
            user = os.getenv("DW_USER"),
            host = host,
            password = os.getenv("DW_PASS"),
            port = os.getenv("DW_PORT"),
        )
        print("Conexão com o banco de dados estabelecidade com sucesso")
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        raise

def disconnect(conn):
    if conn:
        conn.close()
        print("Conexão com o banco de dados encerrada")
    else:
        print("Nenhuma conxão ativa para encerrar")

if __name__ == "__main__":
    conn = connect_dw()
    print(conn)