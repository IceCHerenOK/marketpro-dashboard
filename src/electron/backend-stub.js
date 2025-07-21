// Упрощенная версия бэкенда для Electron
const express = require('express');
const cors = require('cors');
const path = require('path');

function createBackendServer() {
  const app = express();
  const port = process.env.PORT || 3001;
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Базовый маршрут API
  app.get('/api', (req, res) => {
    res.json({
      message: 'MarketPro API работает',
      version: '1.0.0',
      mode: 'electron'
    });
  });
  
  // Аутентификация
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Демо-аутентификация
    if (email === 'chubarov.a@azotstore.ru' && password === 'icekenrok446') {
      res.json({
        success: true,
        token: 'demo-token-123456',
        user: {
          id: 1,
          email: 'chubarov.a@azotstore.ru',
          username: 'Администратор',
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Неверный email или пароль'
      });
    }
  });
  
  // Маршруты для демо-данных
  app.get('/api/marketplaces', (req, res) => {
    res.json([
      { id: 'wildberries', name: 'Wildberries', connected: true },
      { id: 'ozon', name: 'OZON', connected: true },
      { id: 'yandex_market', name: 'Яндекс Маркет', connected: false },
      { id: 'megamarket', name: 'Мегамаркет', connected: false }
    ]);
  });
  
  app.get('/api/orders', (req, res) => {
    res.json({
      orders: [
        { id: 1, external_id: 'WB-12345', marketplace: 'wildberries', status: 'delivered', total_amount: 3450 },
        { id: 2, external_id: 'OZ-67890', marketplace: 'ozon', status: 'processing', total_amount: 1890 }
      ],
      total: 2
    });
  });
  
  // Запуск сервера
  const server = app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
  
  return server;
}

module.exports = { createBackendServer };