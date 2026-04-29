from back.repositories.dashboard_repository import load_data


# =========================
# 🔹 FILTROS
# =========================

def apply_filters(df, team=None, sprint=None, dev=None):
    if team and team not in ("All", "Todos"):
        df = df[df["TEAM"] == team]

    if sprint and sprint not in ("All", "Todos"):
        df = df[df["SPRINT_NUMBER"] == int(sprint)]

    if dev and dev not in ("All", "Todos"):
        df = df[df["NOME_DEV"] == dev]

    return df


def filter_all_data(data, team=None, sprint=None, dev=None):
    return {
        key: apply_filters(df, team, sprint, dev)
        for key, df in data.items()
    }


# =========================
# 🔹 CARDS (ENTREGAS)
# =========================

def calculate_cards_metrics(ticket_improvement):
    planned = ticket_improvement["PLANEJADO"].sum()
    delivered = ticket_improvement["TOTAL_CONCLUIDAS"].sum()
    not_delivered = max(planned - delivered, 0)

    return {
        "planned_cards": int(planned),
        "delivered": int(delivered),
        "not_delivered": int(not_delivered),
    }


# =========================
# 🔹 HORAS (MELHORIAS)
# =========================

def calculate_hours_metrics(ticket_improvement):
    planned = round(ticket_improvement["HORAS_PLANEJADAS"].sum(), 2)
    recorded = round(ticket_improvement["HORAS_APONTADAS"].sum(), 2)
    outstanding = round(max(planned - recorded, 0), 2)

    return {
        "planned_hours": float(planned),
        "recorded": float(recorded),
        "outstanding": float(outstanding),
    }


# =========================
# 🔹 DESVIOS FORMAIS
# =========================

def calculate_formal_deviations(formal_deviations, service_tickets):
    service = service_tickets["HORAS_APONTADAS"].sum()

    grouped = (
        formal_deviations
        .assign(deviation_type=formal_deviations["TIPO_DESVIO"].str.strip().str.upper())
        .groupby("deviation_type")["HORAS_APONTADAS"]
        .sum()
    )

    return {
        "improvement": float(grouped.get("MELHORIA", 0)),
        "revision_adjustment": float(grouped.get("REVISAO AJUSTE", 0)),
        "error_revision": float(grouped.get("REVISAO ERRO", 0)),
        "service": float(service),
    }


# =========================
# 🔹 DESVIOS INFORMAIS
# =========================

def calculate_informal_deviations(informal_deviations):
    grouped = (
        informal_deviations
        .groupby("TICKET_NUMBER")["HORAS_APONTADAS"]
        .sum()
    )

    ticket_map = {
        7: "meeting",
        9: "assistant",
        8: "emergency_service",
        736: "impediment",
        899: "code_review",
        1212: "technical_analysis",
    }

    result = {
        name: round(float(grouped.get(code, 0)), 2)
        for code, name in ticket_map.items()
    }

    return result


# =========================
# 🔹 FUNÇÃO PRINCIPAL
# =========================

def get_dashboard_metrics(team=None, sprint=None, dev=None):
    print("service carregando")

    data = load_data()
    filtered_data = filter_all_data(data, team, sprint, dev)

    ticket_improvement = filtered_data["ticket_improvement"]
    service_tickets = filtered_data["service_tickets"]
    informal_deviations = filtered_data["informal_deviations"]
    formal_deviations = filtered_data["formal_deviations"]

    return {
        "cards": calculate_cards_metrics(ticket_improvement),
        "hours": calculate_hours_metrics(ticket_improvement),
        "formal_deviations": calculate_formal_deviations(formal_deviations, service_tickets),
        "informal_deviations": calculate_informal_deviations(informal_deviations),
    }