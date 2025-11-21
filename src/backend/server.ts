import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import dotenv from 'dotenv';

// Импорт роутеров
import authRoutes from './routes/auth';
import marketplaceRoutes from './routes/marketplaces';
import ordersRoutes from './routes/orders';
import productsRoutes from './routes/products';
import analyticsRoutes from './routes/analytics';
import financeRoutes from './routes/finance';
import advertisingRoutes from './routes/advertising';
import settingsRoutes from './routes/settings';

// Импорт middleware
import errorHandler from './middleware/errorHandler';
import requestLogger from './middleware/logger';

// Импорт базы данных
import initDatabase from './database/init';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173' 
    : false,
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(requestLogger)

// Статические файлы
if (process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.join(__dirname, '../frontend')))
}

// API роуты
// Корневой API эндпоинт
app.get('/api', (req, res) => {
  res.json({
    message: 'Добро пожаловать в API панели управления маркетплейсами',
    version: '1.0.0',
    endpoints: [
      '/api/auth - Аутентификация и управление пользователями',
      '/api/marketplaces - Управление маркетплейсами',
      '/api/orders - Управление заказами',
      '/api/products - Управление товарами',
      '/api/analytics - Аналитика и статистика',
      '/api/finance - Финансовые операции',
      '/api/advertising - Управление рекламой'
    ]
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/marketplaces', marketplaceRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/finance', financeRoutes)
app.use('/api/advertising', advertisingRoutes)
app.use('/api/settings', settingsRoutes)

// Обработка SPA роутинга
if (process.env.NODE_ENV !== 'development') {
  app.get('*', (_req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'))
  })
}

// Обработка ошибок
app.use(errorHandler)

// Инициализация базы данных и запуск сервера
async function startServer() {
  try {
    console.log('🔄 Запуск сервера...')
    console.log('📁 Рабочая директория:', process.cwd())
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV)
    console.log('🔌 PORT:', PORT)
    
    console.log('🔄 Инициализация базы данных...')
    await initDatabase()
    console.log('✅ База данных инициализирована')
    
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`)
      console.log(`📊 Панель управления маркетплейсами готова к работе`)
      console.log(`🌐 Backend API: http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error)
    console.error('📋 Stack trace:', (error as Error).stack)
    process.exit(1)
  }
}

console.log('🎯 Загрузка модулей сервера...')
console.log('📦 Express версия:', require('express/package.json').version)
console.log('🔧 Настройка middleware...')

startServer()