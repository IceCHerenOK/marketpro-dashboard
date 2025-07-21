import jwt from 'jsonwebtoken';

// Определяем интерфейс для запроса с пользователем
interface AuthRequest {
  headers: any;
  user?: any;
}

const authenticateToken = (req: AuthRequest, res: any, next: any) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Токен доступа не предоставлен' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' })
    }
    req.user = user
    next()
  })
}
export default authenticateToken;