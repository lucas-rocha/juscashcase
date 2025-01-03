const express = require('express')
const PublicationController = require('../controllers/PublicationController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

/**
 * @swagger
 * /api/publications:
 *   get:
 *     summary: Busca todas as publicações
 *     tags: [Publications]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo de busca para filtrar publicações
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtrar publicações
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtrar publicações
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Número máximo de publicações retornadas por página
 *     responses:
 *       200:
 *         description: Retorna as publicações agrupadas por status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Título do grupo
 *                   id:
 *                     type: string
 *                     description: Identificador do status
 *                   tasks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Identificador da publicação
 *                         processNumber:
 *                           type: string
 *                           description: Número do processo
 *                         authors:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Lista de autores
 *                         content:
 *                           type: string
 *                           description: Conteúdo da publicação
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           description: Data de atualização da publicação
 *       400:
 *         description: Ocorreu um erro ao buscar as publicações
 */

/**
 * @swagger
 * /api/publications/{id}:
 *   get:
 *     summary: Busca uma publicação pelo ID
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O identificador único da publicação
 *     responses:
 *       200:
 *         description: Retorna os detalhes da publicação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Identificador da publicação
 *                 processNumber:
 *                   type: string
 *                   description: Número do processo
 *                 authors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de autores
 *                 content:
 *                   type: string
 *                   description: Conteúdo da publicação
 *                 status:
 *                   type: string
 *                   description: Status da publicação
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Data de atualização da publicação
 *       400:
 *         description: Ocorreu um erro ao buscar a publicação
 */


/**
 * @swagger
 * /api/publications/{id}/status:
 *   put:
 *     summary: Atualiza o status de uma publicação
 *     tags: [Publications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O identificador único da publicação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Novo status da publicação
 *                 example: concluida
 *     responses:
 *       200:
 *         description: Retorna a publicação atualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Identificador da publicação
 *                 status:
 *                   type: string
 *                   description: Status atualizado da publicação
 *                 processNumber:
 *                   type: string
 *                   description: Número do processo
 *                 authors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de autores
 *                 content:
 *                   type: string
 *                   description: Conteúdo da publicação
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Data de atualização da publicação
 *       400:
 *         description: Ocorreu um erro ao atualizar o status da publicação
 */


const publicationController = new PublicationController()

router.get('/', authMiddleware, publicationController.getPublications)
router.get('/:id', authMiddleware, publicationController.getPublicationsById)
router.put('/:id', authMiddleware, publicationController.updatePublicationStatus)



module.exports = router