const PublicationService = require('../services/PublicationService');

const publicationService = new PublicationService();

class PublicationController {
  async getPublications(req, res) {
    try {
      const { search, dataInicio, dataFim, offset = 0, limit = 30 } = req.query;
  
      // Inicializa o objeto de filtros
      const filters = {};
  
      // Verificar se a dataInicio e dataFim estão definidas e preparar a consulta
      if (dataInicio) {
        filters.dataInicio = new Date(dataInicio); // Converter para objeto Date
      }
      if (dataFim) {
        filters.dataFim = new Date(dataFim); // Converter para objeto Date
      }
  
      // Se search não for fornecido, ignore a pesquisa no filtro
      if (search) {
        filters.search = search;
      }
  
      // Obtenha as publicações com base nos filtros, incluindo a pesquisa
      const publications = await publicationService.getPublications({
        search: filters.search,
        dataInicio: filters.dataInicio,
        dataFim: filters.dataFim,
        offset: parseInt(offset, 10),
        limit: parseInt(limit, 10),
      });
  
      // Mapeamento de status para títulos
      const statusTitles = {
        nova: "Publicações novas",
        lida: "Publicações Lidas",
        enviada_adv: "Publicações Enviadas para o Advogado",
        concluida: "Publicações Concluídas",
      };
  
      // Inicializar o agrupamento com todas as colunas, garantindo que todos os status tenham a propriedade 'tasks'
      const groupedPublications = Object.keys(statusTitles).reduce((acc, status) => {
        acc[status] = {
          title: statusTitles[status],
          id: status,
          tasks: [],
        };
        return acc;
      }, {});
  
      // Agrupar publicações por status
      publications.forEach((pub) => {
        const status = pub.status;
        if (groupedPublications[status]) {
          groupedPublications[status].tasks.push({
            id: pub.id,
            processNumber: pub.processNumber,
            authors: pub.authors,
            content: pub.content,
            updatedAt: pub.updatedAt,
          });
        }
      });
  
      // Retorne os dados agrupados
      res.status(200).json(groupedPublications);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }  
  
  async getPublicationsById(req, res) {
    try {
      const { id } = req.params;  // ID da publicação

      // Usar o serviço para buscar a publicação pelo ID
      const publication = await publicationService.getPublicationById(id);

      res.status(200).json(publication);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updatePublicationStatus(req, res) {
    try {
      const { id } = req.params;  // ID da publicação
      const { status } = req.body;  // Novo status enviado no corpo da requisição

      // Usar o serviço para atualizar o status
      const updatedPublication = await publicationService.updatePublicationStatus(id, status);

      res.status(200).json(updatedPublication);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

}

module.exports = PublicationController;
