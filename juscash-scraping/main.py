import requests
import re
import os
from bs4 import BeautifulSoup
from config import URL_CONSULTA, HEADERS_CONSULTA, BASE_URL_PDF, OUTPUT_DIR_PDF, PARAMS_CONSULTA

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

run_scraping()