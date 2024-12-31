const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt');
const AuthService = require("../services/AuthService")

const prisma = new PrismaClient();

class UserService {
  async create({ fullname, email, password }) {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new Error('Email já cadastrado.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
      },
    });

    return { id: user.id, fullname: user.fullname, email: user.email }
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if(!user)
      throw new Error('User not found!')

    if(!await AuthService.comparePasswords(password, user.password))
      throw new Error('Unauthorized')

    const token = AuthService.generateToken(user.id)

    return {
      token
    }
  }
}

module.exports = UserService