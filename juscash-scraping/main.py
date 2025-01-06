import requests
import re
import os
import pdfplumber
import datetime
import locale
import schedule
import time
import logging
import sys
import datetime
from populate_db import populate_publications, create_publications_table
from decimal import Decimal
from bs4 import BeautifulSoup
from config import REGEX_DATE_AVAILABILITY, REGEX_PLAINTIFFS, REGEX_LAWYERS, REGEX_INSTALLMENTS, REGEX_CASE_NUMBER, END_OF_LINE, URL_CONSULTA, HEADERS_CONSULTA, HEADERS_CONSULTA_SEGUINTE, BASE_URL_PDF, OUTPUT_DIR_PDF, PARAMS_CONSULTA, HEADERS_CONSULTA_SEGUINTE, URL_TROCA

MESES = {
    "janeiro": 1,
    "fevereiro": 2,
    "março": 3,
    "abril": 4,
    "maio": 5,
    "junho": 6,
    "julho": 7,
    "agosto": 8,
    "setembro": 9,
    "outubro": 10,
    "novembro": 11,
    "dezembro": 12,
}

file_path = 'pdf/documento_1.pdf'

def converter_data(data_texto):
    if not data_texto:
        return None
    try:
        partes = data_texto.split(",")[1].strip()  # Ex: "18 de dezembro de 2024"
        dia, mes_texto, ano = partes.split(" de ")

        dia = int(dia)
        mes = MESES[mes_texto.lower()]
        ano = int(ano)

        return datetime.date(ano, mes, dia)
    except (KeyError, ValueError, IndexError):
        return None

def converter_valor(valor_str):
    try:
        if not valor_str:
            return None
        valor_limpo = valor_str.strip().rstrip(',').replace('.', '').replace(',', '.')
        return Decimal(valor_limpo)
    except (InvalidOperation, ValueError):
        return None

def extract_info_pdf(file_path):
    results = []

    with pdfplumber.open(file_path) as pdf:
        full_text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    
    m_data = REGEX_DATE_AVAILABILITY.search(full_text)
    data_disponibilizacao_texto = m_data.group(1).strip() if m_data else None

    if data_disponibilizacao_texto:
        data_disponibilizacao = converter_data(data_disponibilizacao_texto)
        # print(f"Data convertida: {data_disponibilizacao}")
    else:
        print("Data não encontrada.")

    lines = [l.strip() for l in full_text.split('\n')]
    paragrafos = []
    current_paragraph = []
    capturing = False

    for i, line in enumerate(lines):
        if line.startswith("Processo "):
            if current_paragraph:
                current_paragraph = []
            capturing = True
            current_paragraph.append(line)
        elif capturing:
            current_paragraph.append(line)

        if capturing:
            if "ADV:" in line or (i < len(lines) - 1 and lines[i + 1].strip().startswith(END_OF_LINE)):
                paragraph_text = " ".join(current_paragraph).strip()
                capturing = False
                current_paragraph = []
                if "rpv" in paragraph_text.lower() and "pagamento pelo inss" in paragraph_text.lower():
                    paragrafos.append(paragraph_text)

    for paragrafo in paragrafos:
        m_proc = REGEX_CASE_NUMBER.search(paragrafo)
        numero_processo = m_proc.group(1) if m_proc else None
        # print(f"\nNúmero do processo extraído: {numero_processo}")

        m_autores = REGEX_PLAINTIFFS.search(paragrafo)
        autores = m_autores.group(1).strip() if m_autores else None
        # print(f"Autores extraídos: {autores}")

        m_adv = REGEX_LAWYERS.search(paragrafo)
        advogados = m_adv.group(1).strip() if m_adv else None
        # print(f"Advogados extraídos: {advogados}")

        valor_bruto = None
        valor_juros = None
        valor_honorarios = None

        parcelas = REGEX_INSTALLMENTS.findall(paragrafo)
        # print("\nParcelas encontradas:")
        # print(parcelas)

        for val, desc in parcelas:
            val = val.strip()
            if val == '-':
                val = '0,00'
            desc_lower = desc.lower()
            if 'principal' in desc_lower:
                valor_bruto = val
            elif 'juros moratório' in desc_lower:
                valor_juros = val
            elif 'honorário' in desc_lower:
                valor_honorarios = val

       
        valor_bruto = converter_valor(valor_bruto)
        valor_juros = converter_valor(valor_juros)
        valor_honorarios = converter_valor(valor_honorarios)

        results.append((
            numero_processo,
            autores,
            advogados,
            "Instituto Nacional do Seguro Social - INSS",
            paragrafo,
            data_disponibilizacao,
            valor_bruto,
            valor_juros,
            valor_honorarios,
            "nova",
        ))

    return results
    
def process_all_pdfs():
    all_results = []
    for filename in os.listdir(OUTPUT_DIR_PDF):
        if filename.lower().endswith(".pdf"):
            file_path = os.path.join(OUTPUT_DIR_PDF, filename)
            results = extract_info_pdf(file_path)
            all_results.extend(results)
    # insert_documents(all_results)
    # populate_publications(all_results)
    populate_publications(all_results)
    print("Todos os PDFs foram processados.")
    # print(all_results)


def download_pdf(pdf_url, save_path, session):
    # print(f"Baixando PDF de: {pdf_url}")
    try:
        response = session.get(pdf_url, stream=True, timeout=30)
        if response.status_code == 200 and 'application/pdf' in response.headers.get('Content-Type', ''):
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            # print(f"PDF salvo em: {save_path}")
        else:
            print(f"Falha ao baixar PDF. Status: {response.status_code}. Tipo: {response.headers.get('Content-Type')}")
    except requests.exceptions.RequestException as e:
        print(f"Erro ao baixar PDF: {e}")

def fetch_pdfs_from_page(response_text, session, unique_pdf_urls, pdf_count):
    popup_links = re.findall(r"popup\('(/cdje/consultaSimples\.do\?.+?)'\)", response_text)
    print(f"Encontrados {len(popup_links)} links de PDFs na página.")

    for relative_url in popup_links:
      params_match = re.search(r'\?(.*)', relative_url)
      if params_match:
          params = params_match.group(1)
          pdf_url = f"{BASE_URL_PDF}?{params}&uuidCaptcha="
          if pdf_url not in unique_pdf_urls:
              unique_pdf_urls.add(pdf_url)
              pdf_name = os.path.join(OUTPUT_DIR_PDF, f"documento_{pdf_count[0]}.pdf")
              download_pdf(pdf_url, pdf_name, session)
              pdf_count[0] += 1

def run_scraping():
  if not os.path.exists(OUTPUT_DIR_PDF):
        os.makedirs(OUTPUT_DIR_PDF)
        print(f"Diretório criado: {OUTPUT_DIR_PDF}")

  session = requests.Session()
  unique_pdf_urls = set()
  pdf_count = [1]

  try:
    response = session.post(URL_CONSULTA, headers=HEADERS_CONSULTA, data=PARAMS_CONSULTA)
    response.raise_for_status()
    fetch_pdfs_from_page(response.text, session, unique_pdf_urls, pdf_count)

    page_number = 2
    while True:
        # print(f"Fazendo requisição para a página {page_number}...")
        troca_data = f'pagina={page_number}&_='

        cookies_str = '; '.join([f"{key}={value}" for key, value in session.cookies.get_dict().items()])
        HEADERS_CONSULTA_SEGUINTE['Cookie'] = cookies_str

        troca_response = session.post(URL_TROCA, headers=HEADERS_CONSULTA_SEGUINTE, data=troca_data)
        troca_response.raise_for_status()

        previous_count = len(unique_pdf_urls)
        fetch_pdfs_from_page(troca_response.text, session, unique_pdf_urls, pdf_count)

        if len(unique_pdf_urls) == previous_count:
            print("Nenhum novo PDF encontrado, finalizando.")
            break

        page_number += 1

    print("Scraping concluído com sucesso!")
  except requests.exceptions.RequestException as e:
    print(f"Erro ao baixar PDF: {e}")

def run_job():
    logging.info("Iniciando tarefa de populações no banco de dados...")
    
    populate_publications(data)
    
    logging.info("Tarefa de populações concluída.")

if __name__ == "__main__":
    try:
        # Criar a tabela se não existir
        # create_publications_table()
        run_scraping()
        process_all_pdfs()
        # run_job()
    except Exception as e:
        print(f"Erro durante a execução: {e}")
    finally:
        print("Finalizando contêiner.")
        sys.exit(0)