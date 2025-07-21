import expressAuth from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { db: authDb } = require('../database/init')

const authRouter = expressAuth.Router()

// Регистрация
authRouter.post('/register', async (req: any, res: any) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' })
    }

    // Проверяем, существует ли пользователь
    authDb.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], async function(err: any, row: any) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка базы данных' })
      }

      if (row) {
        return res.status(409).json({ error: 'Пользователь уже существует' })
      }

      // Хешируем пароль
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Создаем пользователя
      authDb.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err: any) {
          if (err) {
            return res.status(500).json({ error: 'Ошибка создания пользователя' })
          }

          const token = jwt.sign(
            { id: (this as any).lastID, username, email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
          )

          res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            token,
            user: { id: (this as any).lastID, username, email }
          })
        }
      )
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Авторизация
authRouter.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' })
    }

    authDb.get('SELECT * FROM users WHERE email = ?', [email], async function(err: any, user: any) {
      if (err) {
        return res.status(500).json({ error: 'Ошибка базы данных' })
      }

      if (!user) {
        return res.status(401).json({ error: 'Неверные учетные данные' })
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Неверные учетные данные' })
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      )

      res.json({
        message: 'Успешная авторизация',
        token,
        user: { id: user.id, username: user.username, email: user.email }
      })
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default authRouter