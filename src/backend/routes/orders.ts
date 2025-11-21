import express from 'express'
import authenticateToken from '../middleware/auth'
import { db } from '../database/init'

const ordersRouter = express.Router()

console.log('📦 Загружен роут orders')

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

const mapOrder = (row: any) => ({
  id: row.id,
  marketplace: row.marketplace,
  externalId: row.external_id,
  status: row.status,
  totalAmount: Number(row.total_amount) || 0,
  commission: Number(row.commission) || 0,
  customerName: row.customer_name || '',
  customerPhone: row.customer_phone || '',
  deliveryAddress: row.delivery_address || '',
  deliveryDate: row.delivery_date || null,
  items: row.items ? JSON.parse(row.items) : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

ordersRouter.use(authenticateToken)

ordersRouter.get('/', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { marketplace, status, limit = 50, offset = 0 } = req.query

    let query = 'SELECT * FROM orders WHERE user_id = ?'
    const params: any[] = [userId]

    if (marketplace) {
      query += ' AND marketplace = ?'
      params.push(marketplace)
    }

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await allQuery(query, params)
    res.json({
      orders: rows.map(mapOrder),
      total: rows.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказов' })
  }
})

ordersRouter.get('/:id', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const row = await getQuery('SELECT * FROM orders WHERE user_id = ? AND id = ?', [userId, id])

    if (!row) {
      return res.status(404).json({ error: 'Заказ не найден' })
    }

    res.json({ order: mapOrder(row) })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения заказа' })
  }
})

ordersRouter.put('/:id', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const allowedFields = ['status', 'delivery_date', 'delivery_address']
    const updates: string[] = []
    const params: any[] = []

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`)
        params.push(req.body[field])
      }
    })

    if (!updates.length) {
      return res.status(400).json({ error: 'Нет данных для обновления' })
    }

    params.push(id, userId)

    await runQuery(
      `UPDATE orders SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      params
    )

    res.json({ message: 'Заказ обновлен' })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка обновления заказа' })
  }
})

ordersRouter.post('/sync', async (req: any, res: any) => {
  try {
    const { marketplace } = req.body
    res.json({
      message: 'Синхронизация заказов запущена',
      marketplace: marketplace || 'all'
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка запуска синхронизации' })
  }
})

export default ordersRouter
