const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PublicationService {
  async getPublications({ search, dataInicio, dataFim, offset, limit }) {
    // Formatar dataInicio e dataFim para o formato correto de string (YYYY-MM-DD)
    const formattedDataInicio = dataInicio ? new Date(dataInicio).toISOString().split('T')[0] : null;
    const formattedDataFim = dataFim ? new Date(dataFim).toISOString().split('T')[0] : null;
  
    const where = {
      ...(search && {
        OR: [
          { authors: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { processNumber: { contains: search, mode: "insensitive" } },
          { lawyers: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(formattedDataInicio && {
        availabilityData: { gte: formattedDataInicio }, // Comparando como string
      }),
      ...(formattedDataFim && {
        availabilityData: { lte: formattedDataFim }, // Comparando como string
      }),
      ...(formattedDataInicio && formattedDataFim && {
        availabilityData: {
          gte: formattedDataInicio,
          lte: formattedDataFim,
        },
      }),
    };
  
    // Buscar as publicações com os filtros aplicados
    const publications = await prisma.publications.findMany({
      where,
      skip: offset,
      take: limit,
    });
  
    return publications;
  }
  

  async getPublicationById(id) {
    try {
      const publication = await prisma.publications.findUnique({
        where: { id },
      });

      if (!publication) {
        throw new Error('Publicação não encontrada');
      }

      return publication;
    } catch (error) {
      throw new Error('Erro ao buscar a publicação: ' + error.message);
    }
  }

  async updatePublicationStatus(id, status) {
    try {
      const updatedPublication = await prisma.publications.update({
        where: { id },
        data: { status },
      });

      return updatedPublication;
    } catch (error) {
      throw new Error('Erro ao atualizar o status da publicação: ' + error.message);
    }
  }
}

module.exports = PublicationService;
