const express = require('express')
const UserController = require('../controllers/UserController')

const router = express.Router()

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Faz login de um usuário
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */

const userController = new UserController()

router.post('/', userController.createUser)
router.post('/login', userController.login)


module.exports = router