import express from 'express'
import authenticateToken from '../middleware/auth'
import { db } from '../database/init'

const productsRouter = express.Router()

console.log('📦 Загружен роут products')

const runQuery = (sql: string, params: any[] = []): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err: Error | null) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

const allQuery = <T = any>(sql: string, params: any[] = []): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err: Error | null, rows: T[]) => {
      if (err) {
        return reject(err)
      }
      resolve(rows)
    })
  })
}

const getQuery = <T = any>(sql: string, params: any[] = []): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err: Error | null, row: T | null) => {
      if (err) {
        return reject(err)
      }
      resolve(row)
    })
  })
}

const mapProduct = (row: any) => ({
  id: row.id,
  marketplace: row.marketplace,
  externalId: row.external_id,
  name: row.name,
  sku: row.sku,
  price: Number(row.price) || 0,
  stockQuantity: Number(row.stock_quantity) || 0,
  category: row.category || '',
  brand: row.brand || '',
  description: row.description || '',
  images: row.images ? JSON.parse(row.images) : [],
  status: row.status || 'inactive',
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

productsRouter.use(authenticateToken)

productsRouter.get('/', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { marketplace, status, limit = 50, offset = 0 } = req.query

    let query = 'SELECT * FROM products WHERE user_id = ?'
    const params: any[] = [userId]

    if (marketplace) {
      query += ' AND marketplace = ?'
      params.push(marketplace)
    }

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await allQuery(query, params)
    res.json({ products: rows.map(mapProduct), total: rows.length })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения товаров' })
  }
})

productsRouter.get('/:id', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const row = await getQuery('SELECT * FROM products WHERE user_id = ? AND id = ?', [userId, id])

    if (!row) {
      return res.status(404).json({ error: 'Товар не найден' })
    }

    res.json({ product: mapProduct(row) })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения товара' })
  }
})

productsRouter.post('/', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const {
      marketplace,
      externalId,
      name,
      sku,
      price,
      stockQuantity,
      category,
      brand,
      description,
      images,
      status
    } = req.body

    if (!marketplace || !externalId || !name) {
      return res.status(400).json({ error: 'Обязательные поля: marketplace, externalId, name' })
    }

    await runQuery(
      `INSERT INTO products (user_id, marketplace, external_id, name, sku, price, stock_quantity, category, brand, description, images, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        marketplace,
        externalId,
        name,
        sku,
        price,
        stockQuantity,
        category,
        brand,
        description,
        images ? JSON.stringify(images) : null,
        status || 'active'
      ]
    )

    res.status(201).json({ message: 'Товар создан' })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка создания товара' })
  }
})

productsRouter.put('/:id', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const fields = ['name', 'sku', 'price', 'stock_quantity', 'category', 'brand', 'description', 'images', 'status']
    const updates: string[] = []
    const params: any[] = []

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`)
        params.push(field === 'images' ? JSON.stringify(req.body[field]) : req.body[field])
      }
    })

    if (!updates.length) {
      return res.status(400).json({ error: 'Нет данных для обновления' })
    }

    params.push(id, userId)

    await runQuery(
      `UPDATE products SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      params
    )

    res.json({ message: 'Товар обновлен' })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления товара' })
  }
})

productsRouter.delete('/:id', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    await runQuery('DELETE FROM products WHERE id = ? AND user_id = ?', [id, userId])
    res.json({ message: 'Товар удален' })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка удаления товара' })
  }
})

productsRouter.post('/sync', async (req: any, res: any) => {
  try {
    const { marketplace } = req.body
    res.json({ message: 'Синхронизация товаров запущена', marketplace: marketplace || 'all' })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка запуска синхронизации' })
  }
})

export default productsRouter
