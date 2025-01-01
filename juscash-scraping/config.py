from datetime import datetime

BASE_URL_PDF = 'https://dje.tjsp.jus.br/cdje/getPaginaDoDiario.do'

OUTPUT_DIR_PDF = "./pdf"

URL_CONSULTA = 'https://dje.tjsp.jus.br/cdje/consultaAvancada.do'
HEADERS_CONSULTA = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Origin': 'https://dje.tjsp.jus.br',
  'Referer': 'https://dje.tjsp.jus.br/cdje/consultaAvancada.do',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
}

URL_CONSULTA_SEGUINTE = 'https://dje.tjsp.jus.br/cdje/trocaDePagina.do'
HEADERS_CONSULTA_SEGUINTE = {
  'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Connection': 'keep-alive',
  'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Origin': 'https://dje.tjsp.jus.br',
  'Referer': 'https://dje.tjsp.jus.br/cdje/consultaAvancada.do',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'X-Prototype-Version': '1.6.0.3',
  'X-Requested-With': 'XMLHttpRequest',
  'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
}

data_atual = datetime.now().strftime('%d%%2F%m%%2F%Y')

PARAMS_CONSULTA = f'dadosConsulta.dtInicio=13%2F11%2F2024&dadosConsulta.dtFim=13%2F11%2F2024&dadosConsulta.cdCaderno=12&dadosConsulta.pesquisaLivre=%22RPV%22+e+%22pagamento+pelo+INSS%22&pagina='