import traceback
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import JSONResponse
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("ARQUIVO CERTO RODANDO")

@app.get('/dashboard')
def get_dashboard(team: str = None, sprint: str = None, dev: str = None):

    try:
        tickets_melhorias = pd.read_csv('queries/tickets_melhoria.csv')
        tickets_atendimento = pd.read_csv('queries/tickets_atendimento.csv')
        desvios_informais = pd.read_csv('queries/desvios_informais.csv')
        desvios_formais = pd.read_csv('queries/desvios_formais.csv')

        #Resumo das entregas da Sprint
        cards_planejados = tickets_melhorias['PLANEJADO'].sum()
        cards_entregues = tickets_melhorias['TOTAL_CONCLUIDAS'].sum()
        cards_nao_entregues = max(cards_planejados - cards_entregues, 0)

        #Horas planejadas para as melhorias
        horas_planejadas = tickets_melhorias['HORAS PLANEJADAS'].sum()
        horas_apontadas = tickets_melhorias['HORAS APONTADAS'].sum()
        horas_pendentes = max(horas_planejadas - horas_apontadas, 0)
        gauge_max = 1
        gauge_min = 0
        gauge_target = 100

        #Desvios Formais
        atendimento = tickets_atendimento['HORAS_APONTADAS'].sum()
        agrupado_formais = (
            desvios_formais
            .assign(tipo_desvio=desvios_formais['TIPO_DESVIO'].str.strip().str.upper())
            .groupby('tipo_desvio')['HORAS APONTADAS']
            .sum()
        )
        melhoria = agrupado_formais.get('MELHORIA', 0)
        revisao_ajuste = agrupado_formais.get('REVISAO AJUSTE', 0)
        revisao_erro = agrupado_formais.get('REVISAO ERRO', 0)

        #Desvios Informais
        agrupado_informais = (
            desvios_informais
            .groupby('TICKET_NUMBER')['HORAS_APONTADAS']
            .sum()
        )
        mapa_tickets = {
            7: 'reuniao',
            9: 'auxilio',
            8: 'atendimento_emergencial',
            736: 'impedimento',
            899: 'code_review',
            1212: 'analise_tecnica'
        }

        valores = {
            nome: round(agrupado_informais.get(codigo, 0), 2)
            for codigo, nome in mapa_tickets.items()
        }

        reuniao = valores['reuniao']
        auxilio = valores['auxilio']
        atendimento_emergencial = valores['atendimento_emergencial']
        impedimento = valores['impedimento']
        code_review = valores['code_review']
        analise_tecnica = valores['analise_tecnica']


        #Horas totais
        desvios_informais_soma = reuniao + auxilio + atendimento_emergencial + impedimento + code_review + analise_tecnica
        desvios_formais_soma = melhoria + revisao_ajuste + revisao_erro + atendimento
        #melhorias_sprint = 

        resultado = {
            "cards": {
                "planejados": int(cards_planejados),
                "entregues": int(cards_entregues),
                "nao_entregues": int(cards_nao_entregues)
            },
            "horas": {
                "planejadas": float(horas_planejadas),
                "apontadas": float(horas_apontadas),
                "pendentes": float(horas_pendentes)
            },
            "desvios_formais": {
                "melhoria": float(melhoria),
                "revisao_ajuste": float(revisao_ajuste),
                "revisao_erro": float(revisao_erro),
                "atendimento": float(atendimento)
            },
            "desvios_informais": {
                "reuniao": float(reuniao),
                "auxilio": float(auxilio),
                "atendimento_emergencial": float(atendimento_emergencial),
                "impedimento": float(impedimento),
                "code_review": float(code_review),
                "analise_tecnica": float(analise_tecnica)
            }
        }
        
    except Exception as e:
        traceback.print_exc()
        return {"erro": str(e)}

    
    return JSONResponse(content=resultado)