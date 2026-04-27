import pandas as pd
from back.db.connection import connect_dw
from dotenv import load_dotenv

load_dotenv()

def normalize_columns(df):
    df.columns = (
        df.columns
        .str.strip()
        .str.upper()
        .str.replace(" ", "_")
    )
    return df

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

        tickets_melhoria = normalize_columns(tickets_melhoria)
        tickets_atendimento = normalize_columns(tickets_atendimento)
        desvios_formais = normalize_columns(desvios_formais)
        desvios_informais = normalize_columns(desvios_informais)

        return {
            "tickets_melhorias": tickets_melhoria,
            "tickets_atendimento": tickets_atendimento,
            "desvios_formais": desvios_formais,
            "desvios_informais": desvios_informais
        }
    finally:
        conn.close()

