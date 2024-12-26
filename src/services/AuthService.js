const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class AuthService {
  static async hashPassword(password, salt = 10) {
    return await bcrypt.hash(password, salt)
  }

  static async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }

  static generateToken(user_id) {
    return jwt.sign({ user_id }, 'ABCD')
  }

  static decodeToken(token) {
    return jwt.verify(token, 'ABCD')
  }
}

module.exports = AuthService