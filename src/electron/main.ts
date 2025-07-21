import { app, BrowserWindow, Menu, shell, dialog, nativeImage } from 'electron'
import * as path from 'path'
import { spawn } from 'child_process'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow
let backendProcess: any

function createWindow(): void {
  // Создаем иконку приложения
  const iconPath = isDev 
    ? path.join(__dirname, '../../assets/icon.png')
    : path.join(process.resourcesPath, 'assets/icon.png')

  mainWindow = new BrowserWindow({
    height: 1000,
    width: 1600,
    minHeight: 800,
    minWidth: 1200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    icon: iconPath,
    titleBarStyle: 'default',
    show: false,
    title: 'MarketPro - Панель управления маркетплейсами',
    backgroundColor: '#f8fafc',
    center: true,
    resizable: true,
    maximizable: true,
    minimizable: true,
    closable: true,
    autoHideMenuBar: false
  })

  // Загружаем приложение
  if (isDev) {
    // В режиме разработки подключаемся к Vite серверу
    const loadDevServer = async () => {
      try {
        await mainWindow.loadURL('http://localhost:5176')
        mainWindow.webContents.openDevTools()
      } catch (error) {
        console.error('Не удалось подключиться к серверу разработки:', error)
        // Пробуем другие порты
        try {
          await mainWindow.loadURL('http://localhost:5175')
        } catch {
          try {
            await mainWindow.loadURL('http://localhost:5174')
          } catch {
            await mainWindow.loadURL('http://localhost:5173')
          }
        }
      }
    }
    loadDevServer()
  } else {
    // В production загружаем через HTTP сервер
    console.log('Loading frontend via HTTP server...')
    
    // Ждем запуска сервера и загружаем приложение
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:3001')
    }, 1000)
    
    // DevTools отключены для production
    // mainWindow.webContents.openDevTools()
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Показываем splash screen эффект
    if (!isDev) {
      mainWindow.webContents.executeJavaScript(`
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease-in-out';
        setTimeout(() => {
          document.body.style.opacity = '1';
        }, 100);
      `)
    }
  })

  // Открываем внешние ссылки в браузере
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Обработка ошибок загрузки
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Ошибка загрузки:', errorCode, errorDescription)
    
    // Показываем диалог с ошибкой
    dialog.showErrorBox('Ошибка загрузки', `Не удалось загрузить приложение: ${errorDescription}`)
  })
  
  // Дополнительная отладочная информация
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Приложение успешно загружено')
  })
  
  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM готов')
  })
}

function startBackendServer() {
  if (!isDev) {
    try {
      // Простой HTTP сервер без внешних зависимостей
      const http = require('http');
      const url = require('url');
      const fs = require('fs');
      const path = require('path');
      
      const server = http.createServer((req: any, res: any) => {
        // Устанавливаем CORS заголовки
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }
        
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        
        // Обслуживание статических файлов
        if (pathname === '/' || pathname === '/index.html') {
          // Главная страница
          const htmlPath = path.join(__dirname, '../frontend/index.html');
          console.log('Serving HTML file:', htmlPath);
          
          if (fs.existsSync(htmlPath)) {
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            fs.createReadStream(htmlPath).pipe(res);
            return;
          }
        } else if (pathname && pathname.startsWith('/assets/')) {
          // Статические ресурсы
          const filePath = path.join(__dirname, '../frontend', pathname);
          console.log('Serving static file:', filePath);
          
          if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            let contentType = 'text/plain';
            
            switch (ext) {
              case '.js':
                contentType = 'application/javascript';
                break;
              case '.css':
                contentType = 'text/css';
                break;
              case '.html':
                contentType = 'text/html';
                break;
              case '.json':
                contentType = 'application/json';
                break;
              case '.png':
                contentType = 'image/png';
                break;
              case '.jpg':
              case '.jpeg':
                contentType = 'image/jpeg';
                break;
              case '.svg':
                contentType = 'image/svg+xml';
                break;
            }
            
            res.setHeader('Content-Type', contentType);
            res.writeHead(200);
            fs.createReadStream(filePath).pipe(res);
            return;
          } else {
            console.error('Static file not found:', filePath);
          }
        }
        
        // API маршруты
        res.setHeader('Content-Type', 'application/json');
        
        if (pathname === '/api' && req.method === 'GET') {
          res.writeHead(200);
          res.end(JSON.stringify({
            message: 'MarketPro API работает',
            version: '1.0.0',
            mode: 'electron'
          }));
        } else if (pathname === '/api/auth/login' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { email, password } = JSON.parse(body);
              if (email === 'chubarov.a@azotstore.ru' && password === 'icekenrok446') {
                res.writeHead(200);
                res.end(JSON.stringify({
                  success: true,
                  token: 'demo-token-123456',
                  user: {
                    id: 1,
                    email: 'chubarov.a@azotstore.ru',
                    username: 'Администратор',
                    role: 'admin'
                  }
                }));
              } else {
                res.writeHead(401);
                res.end(JSON.stringify({
                  success: false,
                  message: 'Неверный email или пароль'
                }));
              }
            } catch (error) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
        } else if (pathname === '/api/marketplaces' && req.method === 'GET') {
          res.writeHead(200);
          res.end(JSON.stringify([
            { id: 'wildberries', name: 'Wildberries', connected: true },
            { id: 'ozon', name: 'OZON', connected: true },
            { id: 'yandex_market', name: 'Яндекс Маркет', connected: false },
            { id: 'megamarket', name: 'Мегамаркет', connected: false }
          ]));
        } else if (pathname === '/api/orders' && req.method === 'GET') {
          res.writeHead(200);
          res.end(JSON.stringify({
            orders: [
              { id: 1, external_id: 'WB-12345', marketplace: 'wildberries', status: 'delivered', total_amount: 3450 },
              { id: 2, external_id: 'OZ-67890', marketplace: 'ozon', status: 'processing', total_amount: 1890 }
            ],
            total: 2
          }));
        } else if (pathname === '/api/settings' && req.method === 'GET') {
          // Получение настроек
          res.writeHead(200);
          res.end(JSON.stringify({
            wildberries: {
              apiKey: '',
              supplierToken: '',
              warehouseId: '',
              autoSync: true,
              syncInterval: 15
            },
            ozon: {
              clientId: '',
              apiKey: '',
              warehouseId: '',
              autoSync: true
            },
            yandexMarket: {
              oauthToken: '',
              campaignId: '',
              warehouseId: '',
              autoSync: true
            },
            system: {
              language: 'ru',
              currency: 'RUB',
              timezone: 'Europe/Moscow',
              autoBackup: true,
              backupInterval: 'daily',
              logLevel: 'info'
            }
          }));
        } else if (pathname === '/api/settings' && req.method === 'POST') {
          // Сохранение настроек
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const settings = JSON.parse(body);
              console.log('Сохранение настроек:', settings);
              res.writeHead(200);
              res.end(JSON.stringify({ success: true, message: 'Настройки сохранены' }));
            } catch (error) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
        } else if (pathname === '/api/test-connection' && req.method === 'POST') {
          // Тестирование подключения к маркетплейсу
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { marketplace, settings } = JSON.parse(body);
              console.log(`Тестирование подключения к ${marketplace}:`, settings);
              
              // Имитация тестирования
              setTimeout(() => {
                const success = Math.random() > 0.3; // 70% успеха
                res.writeHead(200);
                res.end(JSON.stringify({ 
                  success, 
                  message: success ? 'Подключение успешно' : 'Ошибка подключения' 
                }));
              }, 1000);
            } catch (error) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
        } else if (pathname === '/api/sync-data' && req.method === 'POST') {
          // Синхронизация данных с маркетплейсом
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { marketplace } = JSON.parse(body);
              console.log(`Синхронизация данных с ${marketplace}`);
              
              res.writeHead(200);
              res.end(JSON.stringify({ 
                success: true, 
                message: `Синхронизация с ${marketplace} запущена`,
                syncedOrders: Math.floor(Math.random() * 50) + 10,
                syncedProducts: Math.floor(Math.random() * 100) + 20
              }));
            } catch (error) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
        } else {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      });
      
      server.listen(3001, () => {
        console.log('Backend server running on port 3001');
      });
      
      backendProcess = server;
    } catch (error) {
      console.error('Ошибка запуска backend сервера:', error);
    }
  }
}

app.whenReady().then(() => {
  createWindow()
  startBackendServer()

  // Создаем меню
  const template: any = [
    {
      label: 'Файл',
      submenu: [
        {
          label: 'Настройки',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            // Открыть настройки
          }
        },
        { type: 'separator' },
        {
          label: 'Выход',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Вид',
      submenu: [
        { role: 'reload', label: 'Перезагрузить' },
        { role: 'forceReload', label: 'Принудительная перезагрузка' },
        { role: 'toggleDevTools', label: 'Инструменты разработчика' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Сбросить масштаб' },
        { role: 'zoomIn', label: 'Увеличить' },
        { role: 'zoomOut', label: 'Уменьшить' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Полный экран' }
      ]
    },
    {
      label: 'Помощь',
      submenu: [
        {
          label: 'О программе',
          click: () => {
            // Показать информацию о программе
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (backendProcess && typeof backendProcess.close === 'function') {
    backendProcess.close()
  }
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  if (backendProcess && typeof backendProcess.close === 'function') {
    backendProcess.close()
  }
})