from back.repositories.dashboard_repository import load_data

def get_dashboard_metrics(team=None, sprint=None, dev=None):
    print("service carregando")
    data = load_data()

    ticket_improvement = data["ticket_improvement"]
    service_tickets = data["service_tickets"]
    informal_deviations = data["informal_deviations"]
    formal_deviations = data["formal_deviations"]

    #Filtros (front-end)
    if team and team != ("All", "Todos"):
        ticket_improvement = ticket_improvement[ticket_improvement['TEAM'] == team]
        service_tickets = service_tickets[service_tickets['TEAM'] == team]
        formal_deviations = formal_deviations[formal_deviations['TEAM'] == team]
        informal_deviations = informal_deviations[informal_deviations['TEAM'] == team]

    if sprint and sprint != ("All", "Todos"):
        ticket_improvement = ticket_improvement[ticket_improvement['SPRINT_NUMBER'] == int(sprint)]
        service_tickets = service_tickets[service_tickets['SPRINT_NUMBER'] == int(sprint)]
        formal_deviations = formal_deviations[formal_deviations['SPRINT_NUMBER'] == int(sprint)]
        informal_deviations = informal_deviations[informal_deviations['SPRINT_NUMBER'] == int(sprint)]

    if dev and dev != ("All", "Todos"):
        ticket_improvement = ticket_improvement[ticket_improvement['NOME_DEV'] == dev]
        service_tickets = service_tickets[service_tickets['NOME_DEV'] == dev]
        formal_deviations = formal_deviations[formal_deviations['NOME_DEV'] == dev]
        informal_deviations = informal_deviations[informal_deviations['NOME_DEV'] == dev]

    # Resumo das entregas da Sprint
    planned_cards = ticket_improvement['PLANEJADO'].sum()
    cards_delivered = ticket_improvement['TOTAL_CONCLUIDAS'].sum()
    cards_not_delivered = max(planned_cards - cards_delivered, 0)

    # Horas planejadas para as melhorias (espaço vira _ após normalize_columns)
    planned_hours = round(ticket_improvement['HORAS_PLANEJADAS'].sum(), 2)
    hours_recorded = round(ticket_improvement['HORAS_APONTADAS'].sum(), 2)
    outstanding_hours = round(max(planned_hours - hours_recorded, 0), 2)

    # Desvios Formais
    service = service_tickets['HORAS_APONTADAS'].sum()
    formal_groups = (
        formal_deviations
        .assign(deviation_type=formal_deviations['TIPO_DESVIO'].str.strip().str.upper())
        .groupby('deviation_type')['HORAS_APONTADAS']  # corrigido: era 'HORAS APONTADAS'
        .sum()
    )
    improvement = formal_groups.get('MELHORIA', 0)
    revision_adjustment = formal_groups.get('REVISAO AJUSTE', 0)
    error_revision = formal_groups.get('REVISAO ERRO', 0)

    # Desvios Informais
    informal_groups = (
        informal_deviations
        .groupby('TICKET_NUMBER')['HORAS_APONTADAS']
        .sum()
    )
    map_tickets = {
        7: 'meeting',
        9: 'assistant',
        8: 'emergency_service',
        736: 'impediment',
        899: 'code_review',
        1212: 'technical_analysis'
    }

    values = {
        nome: round(float(informal_groups[codigo]) if codigo in informal_groups.index else 0, 2)
        for codigo, nome in map_tickets.items()
    }   

    meeting = values['meeting']
    assistant = values['assistant']
    emergency_service = values['emergency_service']
    impediment = values['impediment']
    code_review = values['code_review']
    technical_analysis = values['technical_analysis']

    # Horas totais
    informal_deviations_sum = meeting + assistant + emergency_service + impediment + code_review + technical_analysis
    formal_deviations_sum = improvement + revision_adjustment + error_revision + service

    result = {
        "cards": {
            "planned_cards": int(planned_cards),
            "delivered": int(cards_delivered),
            "not_delivered": int(cards_not_delivered)
        },
        "hours": {
            "planned_hours": float(planned_hours),
            "recorded": float(hours_recorded),
            "outstanding": float(outstanding_hours)
        },
        "formal_deviations": {
            "improvement": float(improvement),
            "revision_adjustment": float(revision_adjustment),
            "error_revision": float(error_revision),
            "service": float(service)
        },
        "informal_deviations": {
            "meeting": float(meeting),
            "emergency_service": float(emergency_service),
            "impediment": float(impediment),
            "code_review": float(code_review),
            "assistant": float(assistant)
        }
    }

    return result