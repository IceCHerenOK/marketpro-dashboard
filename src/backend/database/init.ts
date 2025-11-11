// Заглушка для базы данных без sqlite3
const db = {
  run: (sql: string, params?: any, callback?: Function) => {
    if (typeof params === 'function') {
      callback = params;
      params = undefined;
    }
    console.log('DB Mock - SQL:', sql, params ? `| params: ${JSON.stringify(params)}` : '');
    if (callback) callback(null);
  },
  get: (sql: string, params?: any, callback?: Function) => {
    if (typeof params === 'function') {
      callback = params;
      params = undefined;
    }
    console.log('DB Mock - GET:', sql, params ? `| params: ${JSON.stringify(params)}` : '');
    if (callback) callback(null, null);
  },
  all: (sql: string, params?: any, callback?: Function) => {
    if (typeof params === 'function') {
      callback = params;
      params = undefined;
    }
    console.log('DB Mock - ALL:', sql, params ? `| params: ${JSON.stringify(params)}` : '');
    if (callback) callback(null, []);
  },
  serialize: (callback: Function) => {
    console.log('DB Mock - SERIALIZE');
    callback();
  }
};

async function initDatabase(): Promise<void> {
  console.log('🔄 Создание подключения к базе данных...')
  console.log('📁 Используется заглушка базы данных')
  console.log('📂 Проверка директории данных...')

  return new Promise((resolve, reject) => {
    console.log('🔄 Запуск сериализации базы данных...')
    db.serialize(() => {
      console.log('🔄 Создание таблиц...')
      console.log('📋 Создание таблицы users...')
      // Таблица пользователей
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Таблица настроек маркетплейсов
      db.run(`
        CREATE TABLE IF NOT EXISTS marketplace_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          marketplace TEXT NOT NULL,
          api_key TEXT,
          client_id TEXT,
          secret_key TEXT,
          seller_id TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          UNIQUE(user_id, marketplace)
        )
      `)

      // Таблица товаров
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          marketplace TEXT NOT NULL,
          external_id TEXT NOT NULL,
          name TEXT NOT NULL,
          sku TEXT,
          price DECIMAL(10,2),
          stock_quantity INTEGER DEFAULT 0,
          category TEXT,
          brand TEXT,
          description TEXT,
          images TEXT,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          UNIQUE(user_id, marketplace, external_id)
        )
      `)

      // Таблица заказов
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          marketplace TEXT NOT NULL,
          external_id TEXT NOT NULL,
          status TEXT NOT NULL,
          total_amount DECIMAL(10,2),
          commission DECIMAL(10,2),
          customer_name TEXT,
          customer_phone TEXT,
          delivery_address TEXT,
          delivery_date DATE,
          items TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          UNIQUE(user_id, marketplace, external_id)
        )
      `)

      // Таблица финансов
      db.run(`
        CREATE TABLE IF NOT EXISTS finance_transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          marketplace TEXT NOT NULL,
          transaction_type TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          description TEXT,
          order_id TEXT,
          transaction_date DATE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `)

      // Таблица рекламных кампаний
      db.run(`
        CREATE TABLE IF NOT EXISTS advertising_campaigns (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          marketplace TEXT NOT NULL,
          external_id TEXT NOT NULL,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          status TEXT NOT NULL,
          budget DECIMAL(10,2),
          spent DECIMAL(10,2) DEFAULT 0,
          clicks INTEGER DEFAULT 0,
          impressions INTEGER DEFAULT 0,
          conversions INTEGER DEFAULT 0,
          start_date DATE,
          end_date DATE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          UNIQUE(user_id, marketplace, external_id)
        )
      `)

      // Таблица аналитики
      db.run(`
        CREATE TABLE IF NOT EXISTS analytics_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          marketplace TEXT NOT NULL,
          metric_type TEXT NOT NULL,
          metric_value DECIMAL(15,2),
          date DATE NOT NULL,
          additional_data TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('❌ Ошибка создания таблиц:', err)
          reject(err)
        } else {
          console.log('✅ Все таблицы созданы успешно')
          resolve()
        }
      })
    })
  })
}

export { db };
export default initDatabase;