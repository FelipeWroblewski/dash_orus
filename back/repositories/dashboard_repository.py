import pandas as pd
from back.db.connection import connect_dw
from dotenv import load_dotenv

load_dotenv()

def load_data():
    conn = connect_dw()

    try:
        tickets_melhoria = pd.read_sql(
            """
                SELECT * FROM ti.forus_melhoria
            """, conn
        )

        tickets_atendimento = pd.read_sql(
            """
                SELECT * FROM ti.forus_atendimento
            """, conn
        )

        desvios_informais = pd.read_sql(
            """
                SELECT * FROM ti.forus_desvios_informais
            """, conn
        )

        desvios_formais = pd.read_sql(
            """
                SELECT * FROM ti.forus_desvios_formais
            """, conn
        )

        return {
            "tickets_melhorias": tickets_melhoria,
            "tickets_atendimento": tickets_atendimento,
            "desvios_formais": desvios_formais,
            "desvios_informais": desvios_informais
        }
    finally:
        conn.close()

