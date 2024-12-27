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
        nova: 'Publicações novas',
        lida: 'Publicações Lidas',
        enviada_adv: 'Publicações Enviadas para o Advogado',
        concluida: 'Publicações Concluídas',
        unknown: 'Status desconhecido',
      };

      // Agrupe as publicações por status
      const groupedPublications = publications.reduce((acc, pub) => {
        const status = pub.status || 'unknown'; // Use 'unknown' se o status estiver vazio
        const title = statusTitles[status] || statusTitles.unknown; // Obtenha o título do status

        if (!acc[status]) {
          acc[status] = {
            title,
            id: status,
            tasks: [],
          };
        }
        acc[status].tasks.push({
          id: pub.id,
          processNumber: pub.processNumber,
          authors: pub.authors,
          content: pub.content,
        });
        return acc;
      }, {});

      // Retorne os dados agrupados
      res.status(200).json(groupedPublications);
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
