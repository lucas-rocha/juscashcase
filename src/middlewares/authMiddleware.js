const AuthService = require('./services/AuthService');

function authMiddleware(req, res, next) {
  try {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const claims = AuthService.decodeToken(token);

    req.context = {
      user_id: claims.user_id
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;
