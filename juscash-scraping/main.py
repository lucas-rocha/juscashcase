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
from config import MONTHS, REGEX_DATE_AVAILABILITY, REGEX_PLAINTIFFS, REGEX_LAWYERS, REGEX_INSTALLMENTS, REGEX_CASE_NUMBER, END_OF_LINE, URL_CONSULTA, HEADERS_CONSULTA, HEADERS_CONSULTA_SEGUINTE, BASE_URL_PDF, OUTPUT_DIR_PDF, PARAMS_CONSULTA, HEADERS_CONSULTA_SEGUINTE, URL_TROCA

MONTHS = {
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

def converter_data(data_texto):
    if not data_texto:
        return None
    try:
        partes = data_texto.split(",")[1].strip()
        dia, mes_texto, ano = partes.split(" de ")

        dia = int(dia)
        mes = MONTHS[mes_texto.lower()]
        ano = int(ano)

        return datetime.date(ano, mes, dia)
    except (KeyError, ValueError, IndexError):
        return None

def converter_valor(string_value):
    try:
        if not string_value:
            return None
        new_value = string_value.strip().rstrip(',').replace('.', '').replace(',', '.')
        return Decimal(new_value)
    except (InvalidOperation, ValueError):
        return None

def extract_info_pdf(file_path):
    results = []

    with pdfplumber.open(file_path) as pdf:
        full_text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    
    availability_data = REGEX_DATE_AVAILABILITY.search(full_text)
    availability_data_txt = availability_data.group(1).strip() if availability_data else None

    if availability_data_txt:
        availability_data = converter_data(availability_data_txt)
    else:
        print("Data não encontrada.")

    lines = [l.strip() for l in full_text.split('\n')]
    paragraphs = []
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
                    paragraphs.append(paragraph_text)

    for paragraph in paragraphs:
        get_process = REGEX_CASE_NUMBER.search(paragraph)
        process_number = get_process.group(1) if get_process else None

        get_authors = REGEX_PLAINTIFFS.search(paragraph)
        authors = get_authors.group(1).strip() if get_authors else None

        get_lawyers = REGEX_LAWYERS.search(paragraph)
        lawyers = get_lawyers.group(1).strip() if get_lawyers else None

        principal_value = None
        interest_value = None
        attorney_fees = None

        parcelas = REGEX_INSTALLMENTS.findall(paragraph)

        for val, desc in parcelas:
            val = val.strip()
            if val == '-':
                val = '0,00'
            desc_lower = desc.lower()
            if 'principal' in desc_lower:
                principal_value = val
            elif 'juros moratório' in desc_lower:
                interest_value = val
            elif 'honorário' in desc_lower:
                attorney_fees = val

       
        principal_value = converter_valor(principal_value)
        interest_value = converter_valor(interest_value)
        attorney_fees = converter_valor(attorney_fees)

        results.append((
            process_number,
            authors,
            lawyers,
            "Instituto Nacional do Seguro Social - INSS",
            paragraph,
            availability_data,
            principal_value,
            interest_value,
            attorney_fees,
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
    populate_publications(all_results)


def download_pdf(pdf_url, save_path, session):
    try:
        response = session.get(pdf_url, stream=True, timeout=30)
        if response.status_code == 200 and 'application/pdf' in response.headers.get('Content-Type', ''):
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
        else:
            print(f"Falha ao baixar PDF. Status: {response.status_code}. Tipo: {response.headers.get('Content-Type')}")
    except requests.exceptions.RequestException as e:
        print(f"Erro ao baixar PDF: {e}")

def fetch_pdfs_from_page(response_text, session, unique_pdf_urls, pdf_count):
    popup_links = re.findall(r"popup\('(/cdje/consultaSimples\.do\?.+?)'\)", response_text)

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

  session = requests.Session()
  unique_pdf_urls = set()
  pdf_count = [1]

  try:
    response = session.post(URL_CONSULTA, headers=HEADERS_CONSULTA, data=PARAMS_CONSULTA)
    response.raise_for_status()
    fetch_pdfs_from_page(response.text, session, unique_pdf_urls, pdf_count)

    page_number = 2
    while True:
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
        run_scraping()
        process_all_pdfs()
    except Exception as e:
        print(f"Erro durante a execução: {e}")
    finally:
        print("Finalizando contêiner.")
        sys.exit(0)