import express from 'express'
import authenticateToken from '../middleware/auth'
import { db } from '../database/init'

const analyticsRouter = express.Router()

console.log('📦 Загружен роут analytics')

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

analyticsRouter.use(authenticateToken)

analyticsRouter.get('/summary', async (req: any, res: any) => {
  try {
    const userId = req.user.id

    const row = await getQuery(
      `SELECT COUNT(*) as ordersCount, COALESCE(SUM(total_amount), 0) as revenue, COALESCE(AVG(total_amount), 0) as avgOrder
       FROM orders WHERE user_id = ?`,
      [userId]
    )

    res.json({
      revenue: Number(row?.revenue || 0),
      ordersCount: Number(row?.ordersCount || 0),
      avgOrderValue: Number(row?.avgOrder || 0),
      conversionRate: 0
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения сводных данных' })
  }
})

analyticsRouter.get('/sales', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const rows = await allQuery(
      `SELECT strftime('%Y-%m-%d', created_at) as date, COUNT(*) as value
       FROM orders WHERE user_id = ? GROUP BY strftime('%Y-%m-%d', created_at) ORDER BY date ASC`,
      [userId]
    )

    res.json({ data: rows.map(row => ({ date: row.date, value: Number(row.value || 0) })) })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения данных по заказам' })
  }
})

analyticsRouter.get('/revenue', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const rows = await allQuery(
      `SELECT strftime('%Y-%m-%d', created_at) as date, COALESCE(SUM(total_amount), 0) as value
       FROM orders WHERE user_id = ? GROUP BY strftime('%Y-%m-%d', created_at) ORDER BY date ASC`,
      [userId]
    )

    res.json({ data: rows.map(row => ({ date: row.date, value: Number(row.value || 0) })) })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения данных по выручке' })
  }
})

analyticsRouter.get('/products', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const rows = await allQuery(
      `SELECT marketplace, COUNT(*) as value FROM products WHERE user_id = ? GROUP BY marketplace ORDER BY value DESC`,
      [userId]
    )

    res.json({ data: rows.map(row => ({ marketplace: row.marketplace, value: Number(row.value || 0) })) })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения данных по товарам' })
  }
})

analyticsRouter.get('/marketplaces', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const rows = await allQuery(
      `SELECT marketplace, COUNT(*) as orders, COALESCE(SUM(total_amount), 0) as revenue
       FROM orders WHERE user_id = ? GROUP BY marketplace`,
      [userId]
    )

    res.json({
      data: rows.map(row => ({
        marketplace: row.marketplace,
        orders: Number(row.orders || 0),
        revenue: Number(row.revenue || 0)
      }))
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения распределения по маркетплейсам' })
  }
})

export default analyticsRouter
