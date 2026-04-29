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
        ticket_improvement = pd.read_sql(
            """
                SELECT * FROM ti.forus_melhoria
            """, conn
        )

        service_tickets = pd.read_sql(
            """
                SELECT * FROM ti.forus_atendimento
            """, conn
        )

        informal_deviations = pd.read_sql(
            """
                SELECT * FROM ti.forus_desvios_informais
            """, conn
        )

        formal_deviations = pd.read_sql(
            """
                SELECT * FROM ti.forus_desvios_formais
            """, conn
        )

        ticket_improvement = normalize_columns(ticket_improvement)
        service_tickets = normalize_columns(service_tickets)
        formal_deviations = normalize_columns(formal_deviations)
        informal_deviations = normalize_columns(informal_deviations)

        return {
            "ticket_improvement": ticket_improvement,
            "service_tickets": service_tickets,
            "formal_deviations": formal_deviations,
            "informal_deviations": informal_deviations
        }
    finally:
        conn.close()

