# MarketPro - Инструкции по сборке

## Требования

- Node.js 18+ 
- npm или yarn
- Windows 10/11 (для сборки Windows приложения)

## Установка зависимостей

```bash
npm install
```

## Разработка

### Запуск в режиме разработки (веб)
```bash
npm run dev
```
Откроется браузер на http://localhost:5176

### Запуск в режиме разработки (Electron)
```bash
npm run electron:dev
```

## Сборка для продакшена

### 1. Сборка всех компонентов
```bash
npm run build
```

### 2. Сборка Windows приложения

#### Установщик NSIS (.exe)
```bash
npm run dist:win
```

#### Портативная версия
```bash
npm run dist:portable
```

#### Обе версии
```bash
npm run dist
```

## Результаты сборки

Готовые файлы будут находиться в папке `release/`:

- `MarketPro Setup 1.0.0.exe` - Установщик
- `MarketPro-Portable-1.0.0.exe` - Портативная версия

## Структура проекта

```
├── src/
│   ├── frontend/     # React приложение
│   ├── backend/      # Node.js сервер
│   └── electron/     # Electron main процесс
├── assets/           # Иконки и ресурсы
├── dist/            # Скомпилированные файлы
└── release/         # Готовые приложения
```

## Учетные данные для входа

- Email: chubarov.a@azotstore.ru
- Пароль: icekenrok446

## Возможные проблемы

### Ошибка "Port already in use"
```bash
# Найти и завершить процесс на порту 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Ошибки сборки
- Убедитесь, что все зависимости установлены
- Проверьте, что Node.js версии 18+
- Очистите кэш: `npm run clean` (если есть такой скрипт)

## Дополнительные команды

```bash
# Только сборка без создания установщика
npm run pack

# Запуск готового Electron приложения
npm run electron

# Создание иконки
node create-icon-png.js
```