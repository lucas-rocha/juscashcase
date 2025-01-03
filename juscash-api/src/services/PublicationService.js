const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PublicationService {
  async getPublications({ search, dataInicio, dataFim, offset, limit }) {
    const where = {
      ...(search && {
        OR: [
          { authors: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { processNumber: { contains: search, mode: "insensitive" } },
          { lawyers: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(dataInicio && {
        createdAt: { gte: new Date(dataInicio) }, // Se apenas dataInicio for fornecido
      }),
      ...(dataFim && {
        createdAt: { lte: new Date(dataFim) }, // Se apenas dataFim for fornecido
      }),
      ...(dataInicio && dataFim && {
        createdAt: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        }, // Caso ambas as datas sejam fornecidas
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
