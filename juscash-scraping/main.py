import requests
import re
import os
import pdfplumber
import datetime
import locale
from decimal import Decimal
from bs4 import BeautifulSoup
from config import REGEX_DATE_AVAILABILITY, REGEX_PLAINTIFFS, REGEX_LAWYERS, REGEX_INSTALLMENTS, END_OF_LINE, URL_CONSULTA, HEADERS_CONSULTA, BASE_URL_PDF, OUTPUT_DIR_PDF, PARAMS_CONSULTA


file_path = 'pdf/documento_1.pdf'

def converter_data(data_texto):
    # Defina o idioma do sistema para português para lidar com os meses em português
    locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')  # Isso pode precisar ser ajustado dependendo do sistema operacional

    try:
        # Converte a data para o formato 'yyyy-mm-dd'
        data = datetime.datetime.strptime(data_texto, '%A, %d de %B de %Y')
        return data.strftime('%Y-%m-%d')
    except ValueError as e:
        print(f"Erro ao converter data: {e}")
        return None

def converter_valor(valor_str):
    """Converte valor monetário em Decimal."""
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
        print(f"Data convertida: {data_disponibilizacao}")
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
        print(f"\nNúmero do processo extraído: {numero_processo}")

        m_autores = REGEX_PLAINTIFFS.search(paragrafo)
        autores = m_autores.group(1).strip() if m_autores else None
        print(f"Autores extraídos: {autores}")

        m_adv = REGEX_LAWYERS.search(paragrafo)
        advogados = m_adv.group(1).strip() if m_adv else None
        print(f"Advogados extraídos: {advogados}")

        valor_bruto = None
        valor_juros = None
        valor_honorarios = None

        parcelas = REGEX_INSTALLMENTS.findall(paragrafo)
        print("\nParcelas encontradas:")
        print(parcelas)

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

        print(f"Valor bruto: {valor_bruto}")
        print(f"Valor de juros moratórios: {valor_juros}")
        print(f"Honorários advocatícios: {valor_honorarios}")
    
    # Converter valores
        valor_bruto = converter_valor(valor_bruto)
        valor_juros = converter_valor(valor_juros)
        valor_honorarios = converter_valor(valor_honorarios)

        print(f"Valores convertidos - Bruto: {valor_bruto}, Juros: {valor_juros}, Honorários: {valor_honorarios}")

        results.append((
            os.path.basename(file_path),
            data_disponibilizacao,
            numero_processo,
            autores,
            advogados,
            valor_bruto,
            valor_juros,
            valor_honorarios,
            paragrafo,
            "Instituto Nacional do Seguro Social - INSS",
            "nova",
        ))

    return results

    
def process_all_pdfs():
    """Processa todos os PDFs no diretório especificado."""
    all_results = []
    for filename in os.listdir(OUTPUT_DIR_PDF):
        if filename.lower().endswith(".pdf"):
            file_path = os.path.join(OUTPUT_DIR_PDF, filename)
            print(f"Processando arquivo: {file_path}")
            results = extract_info_pdf(file_path)
            all_results.extend(results)
    # insert_documents(all_results)
    print("Todos os PDFs foram processados.")
    print(all_results)


def download_pdf(pdf_url, save_path, session):
    print(f"Baixando PDF de: {pdf_url}")
    try:
        response = session.get(pdf_url, stream=True, timeout=30)
        if response.status_code == 200 and 'application/pdf' in response.headers.get('Content-Type', ''):
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"PDF salvo em: {save_path}")
        else:
            print(f"Falha ao baixar PDF. Status: {response.status_code}. Tipo: {response.headers.get('Content-Type')}")
    except requests.exceptions.RequestException as e:
        print(f"Erro ao baixar PDF: {e}")

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

    popup_links = re.findall(r"popup\('(/cdje/consultaSimples\.do\?.+?)'\)", response.text)
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
          print(pdf_url)
  except requests.exceptions.RequestException as e:
    print(f"Erro na requisição: {e}")

# run_scraping()
# extract_info_pdf(file_path)
process_all_pdfs()