const PublicationService = require('../services/PublicationService');

const publicationService = new PublicationService();

class PublicationController {
  async getPublications(req, res) {
    try {
      const { search, dataInicio, dataFim, offset = 0, limit = 30 } = req.query;
  
      // Obtenha os dados do serviço
      const publications = await publicationService.getPublications({
        search,
        dataInicio,
        dataFim,
        offset: parseInt(offset, 10),
        limit: parseInt(limit, 10),
      });
  
      // Mapeamento de status para títulos
      const statusTitles = {
        nova: "Publicações novas",
        lida: "Publicações Lidas",
        enviada_adv: "Publicações Enviadas para o Advogado",
        concluida: "Publicações Concluídas"
      };
  
      // Inicializar o agrupamento com todas as colunas
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
        const status = pub.status || "unknown"; // Use 'unknown' se o status estiver vazio
        groupedPublications[status].tasks.push({
          id: pub.id,
          processNumber: pub.processNumber,
          authors: pub.authors,
          content: pub.content,
          updatedAt: pub.updatedAt
        });
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
