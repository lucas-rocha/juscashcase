const PublicationService = require("../services/PublicationService");

const publicationService = new PublicationService();

class PublicationController {
  async getPublications(req, res) {
    try {
      const { search, dataInicio, dataFim, offset = 0, limit = 30 } = req.query;

      const publications = await publicationService.getPublications({
        search,
        dataInicio,
        dataFim,
        offset: parseInt(offset, 10),
        limit: parseInt(limit, 10),
      });

      res.status(200).json(publications);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = PublicationController;