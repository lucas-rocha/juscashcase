const express = require('express')
const UserController = require('../controllers/UserController')

const router = express.Router()

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: Nome completo do usuário
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: joao.silva@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Identificador único do usuário
 *                     fullname:
 *                       type: string
 *                       description: Nome completo do usuário
 *                     email:
 *                       type: string
 *                       description: Email do usuário
 *       400:
 *         description: Ocorreu um erro ao criar o usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Detalhes do erro
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: joao.silva@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Identificador único do usuário
 *                     fullname:
 *                       type: string
 *                       description: Nome completo do usuário
 *                     email:
 *                       type: string
 *                       description: Email do usuário
 *       400:
 *         description: Erro de autenticação ou falha ao realizar o login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Detalhes do erro
 */


const userController = new UserController()

router.post('/', userController.createUser)
router.post('/login', userController.login)

module.exports = router