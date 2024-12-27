const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PublicationService {
  async getPublications({ search, dataInicio, dataFim, offset, limit }) {
    const where = {};

    // Filtrar por "search" no conteúdo ou nos autores
    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { authors: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtrar por intervalo de datas
    if (dataInicio || dataFim) {
      where.createdAt = {};
      
      if (dataInicio) {
        where.createdAt.gte = new Date(dataInicio); // data de início maior ou igual
      }
      
      if (dataFim) {
        where.createdAt.lte = new Date(dataFim); // data de fim menor ou igual
      }
    }

    // Paginando os resultados
    const publications = await prisma.publications.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }, // Ordenando pela data de criação
    });

    // Retornando os resultados
    return publications;
  }
}

module.exports = PublicationService;