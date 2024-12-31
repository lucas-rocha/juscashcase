const UserService = require("../services/UserService")

const userService = new UserService()

class UserController {
  async createUser(req, res) {
    try {
      const { fullname, email, password } = req.body
      const user = await userService.create({ fullname, email, password })
      
      res.status(201).json({ message: 'Usuário criado com sucesso.', user })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await userService.login({ email, password })
      
      res.status(201).json({ message: 'Usuário logado com sucesso.', user })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = UserController