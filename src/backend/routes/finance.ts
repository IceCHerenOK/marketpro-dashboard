import express from 'express'
import authenticateToken from '../middleware/auth'
import { db } from '../database/init'

const financeRouter = express.Router()

console.log('📦 Загружен роут finance')

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

financeRouter.use(authenticateToken)

financeRouter.get('/transactions', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { marketplace, type, limit = 50, offset = 0 } = req.query

    let query = 'SELECT * FROM finance_transactions WHERE user_id = ?'
    const params: any[] = [userId]

    if (marketplace) {
      query += ' AND marketplace = ?'
      params.push(marketplace)
    }

    if (type) {
      query += ' AND transaction_type = ?'
      params.push(type)
    }

    query += ' ORDER BY transaction_date DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const rows = await allQuery(query, params)

    res.json({
      transactions: rows.map(row => ({
        id: row.id,
        marketplace: row.marketplace,
        transactionType: row.transaction_type,
        amount: Number(row.amount) || 0,
        description: row.description || '',
        orderId: row.order_id || null,
        transactionDate: row.transaction_date,
        createdAt: row.created_at
      })),
      total: rows.length
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения транзакций' })
  }
})

financeRouter.get('/summary', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const rows = await allQuery('SELECT transaction_date, amount FROM finance_transactions WHERE user_id = ?', [userId])

    let totalIncome = 0
    let totalExpenses = 0
    const daily = new Map<string, { income: number; expenses: number }>()

    rows.forEach(row => {
      const amount = Number(row.amount) || 0
      const date = row.transaction_date
      const entry = daily.get(date) || { income: 0, expenses: 0 }

      if (amount >= 0) {
        entry.income += amount
        totalIncome += amount
      } else {
        entry.expenses += Math.abs(amount)
        totalExpenses += Math.abs(amount)
      }

      daily.set(date, entry)
    })

    const trend = Array.from(daily.entries()).map(([date, value]) => ({
      date,
      income: value.income,
      expenses: value.expenses,
      profit: value.income - value.expenses
    }))

    res.json({
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      trend: trend.sort((a, b) => (a.date > b.date ? 1 : -1))
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения сводки' })
  }
})

financeRouter.get('/balance', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const row = await getQuery(
      `SELECT COALESCE(SUM(CASE WHEN amount >= 0 THEN amount ELSE 0 END), 0) as income,
              COALESCE(SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END), 0) as expenses
       FROM finance_transactions WHERE user_id = ?`,
      [userId]
    )

    const income = Number(row?.income || 0)
    const expenses = Number(row?.expenses || 0)

    res.json({ totalIncome: income, totalExpenses: expenses, netProfit: income - expenses })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения баланса' })
  }
})

financeRouter.get('/report', async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const rows = await allQuery(
      `SELECT marketplace,
              SUM(CASE WHEN amount >= 0 THEN amount ELSE 0 END) as income,
              SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as expenses
       FROM finance_transactions
       WHERE user_id = ?
       GROUP BY marketplace`,
      [userId]
    )

    res.json({
      byMarketplace: rows.map(row => ({
        marketplace: row.marketplace,
        income: Number(row.income || 0),
        expenses: Number(row.expenses || 0),
        net: Number(row.income || 0) - Number(row.expenses || 0)
      }))
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка формирования отчета' })
  }
})

export default financeRouter
