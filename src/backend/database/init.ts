import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';

type DbCallback = (err?: Error | null) => void;
type RowCallback = (err?: Error | null, row?: any) => void;
type RowsCallback = (err?: Error | null, rows?: any[]) => void;

interface DbWrapper {
  run: (sql: string, params?: any[] | Record<string, any>, callback?: DbCallback) => void;
  get: (sql: string, params?: any[] | Record<string, any>, callback?: RowCallback) => void;
  all: (sql: string, params?: any[] | Record<string, any>, callback?: RowsCallback) => void;
  serialize: (callback: () => void) => void;
}

const db: DbWrapper = {
  run: () => {
    throw new Error('Database not initialized');
  },
  get: () => {
    throw new Error('Database not initialized');
  },
  all: () => {
    throw new Error('Database not initialized');
  },
  serialize: (callback) => {
    callback();
  }
};

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'marketpro.sqlite');

const ensureArrayParams = (params?: any[] | Record<string, any>) => {
  if (!params) return [];
  if (Array.isArray(params)) return params;
  return Object.values(params);
};

const seedAdminUser = async (wrapper: DbWrapper) => {
  const defaultAdmin = {
    email: process.env.ADMIN_EMAIL || 'chubarov.a@azotstore.ru',
    password: process.env.ADMIN_PASSWORD || 'icekenrok446',
    username: process.env.ADMIN_USERNAME || 'admin'
  };

  return new Promise<void>((resolve, reject) => {
    wrapper.get('SELECT id FROM users WHERE email = ?', [defaultAdmin.email], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row) {
        resolve();
        return;
      }

      const hashedPassword = bcrypt.hashSync(defaultAdmin.password, 10);
      wrapper.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [defaultAdmin.username, defaultAdmin.email, hashedPassword],
        (insertErr) => {
          if (insertErr) {
            reject(insertErr);
            return;
          }
          console.log(`Seeded admin user: ${defaultAdmin.email}`);
          resolve();
        }
      );
    });
  });
};

async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: (file) => path.resolve(process.cwd(), 'node_modules', 'sql.js', 'dist', file)
  });

  const fileBuffer = fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : undefined;
  const database = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

  const persist = () => {
    const data = database.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  };

  const wrapStatement = (sql: string, params?: any[] | Record<string, any>) => {
    const stmt = database.prepare(sql);
    const boundParams = ensureArrayParams(params);
    stmt.bind(boundParams);
    return stmt;
  };

  const normalizeArgs = <T extends Function>(
    params?: any[] | Record<string, any> | T,
    callback?: T
  ) => {
    if (typeof params === 'function') {
      return { params: undefined, callback: params as T };
    }
    return { params, callback };
  };

  const wrapper: DbWrapper = {
    run: (sql, params, callback) => {
      const normalized = normalizeArgs<DbCallback>(params, callback);
      try {
        const stmt = wrapStatement(sql, normalized.params);
        stmt.step();
        stmt.free();
        const lastIdResult = database.exec('SELECT last_insert_rowid() as id');
        const lastID = lastIdResult?.[0]?.values?.[0]?.[0];
        const changes = database.getRowsModified();
        persist();
        if (normalized.callback) {
          normalized.callback.call({ lastID, changes }, null);
        }
      } catch (error) {
        if (normalized.callback) normalized.callback(error as Error);
      }
    },
    get: (sql, params, callback) => {
      const normalized = normalizeArgs<RowCallback>(params, callback);
      try {
        const stmt = wrapStatement(sql, normalized.params);
        let row;
        if (stmt.step()) {
          row = stmt.getAsObject();
        }
        stmt.free();
        if (normalized.callback) normalized.callback(null, row);
      } catch (error) {
        if (normalized.callback) normalized.callback(error as Error);
      }
    },
    all: (sql, params, callback) => {
      const normalized = normalizeArgs<RowsCallback>(params, callback);
      try {
        const stmt = wrapStatement(sql, normalized.params);
        const rows: any[] = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        if (normalized.callback) normalized.callback(null, rows);
      } catch (error) {
        if (normalized.callback) normalized.callback(error as Error);
      }
    },
    serialize: (callback) => {
      callback();
    }
  };
  Object.assign(db, wrapper);

  db.run('PRAGMA foreign_keys = ON');

  console.log('Initializing database schema...');
  await new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

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
      `);

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
      `);

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
      `);

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
      `);

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
      `);

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
          console.error('Failed to create tables:', err);
          reject(err);
        } else {
          resolve();
        }
      });

      db.run(`
        CREATE TABLE IF NOT EXISTS knowledge_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          category TEXT,
          marketplace TEXT,
          content_html TEXT NOT NULL,
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);
    });
  });

  await seedAdminUser(db);
  console.log('Database schema is ready');
}

export { db };
export default initDatabase;
