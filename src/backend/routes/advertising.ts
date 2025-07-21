import expressAdvertising from 'express';
import authenticateToken from '../middleware/auth';
import { db } from '../database/init';

const advertisingRouter = expressAdvertising.Router()

// Получить рекламные кампании
advertisingRouter.get('/campaigns', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { marketplace, status, limit = 100, offset = 0 } = req.query

    let query = 'SELECT * FROM advertising_campaigns WHERE user_id = ?'
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

    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка получения кампаний' })
      }

      res.json({ campaigns: rows, total: rows.length })
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Получить статистику рекламы
advertisingRouter.get('/stats', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { dateFrom, dateTo, marketplace } = req.query

    let dateFilter = ''
    let marketplaceFilter = ''
    const params: any[] = [userId]

    if (dateFrom && dateTo) {
      dateFilter = ' AND created_at BETWEEN ? AND ?'
      params.push(dateFrom, dateTo)
    }

    if (marketplace) {
      marketplaceFilter = ' AND marketplace = ?'
      params.push(marketplace)
    }

    const queries = [
      // Общий бюджет
      `SELECT SUM(budget) as total_budget FROM advertising_campaigns WHERE user_id = ?${dateFilter}${marketplaceFilter}`,
      // Потрачено
      `SELECT SUM(spent) as total_spent FROM advertising_campaigns WHERE user_id = ?${dateFilter}${marketplaceFilter}`,
      // Клики
      `SELECT SUM(clicks) as total_clicks FROM advertising_campaigns WHERE user_id = ?${dateFilter}${marketplaceFilter}`,
      // Показы
      `SELECT SUM(impressions) as total_impressions FROM advertising_campaigns WHERE user_id = ?${dateFilter}${marketplaceFilter}`,
      // Конверсии
      `SELECT SUM(conversions) as total_conversions FROM advertising_campaigns WHERE user_id = ?${dateFilter}${marketplaceFilter}`,
      // По маркетплейсам
      `SELECT marketplace, SUM(spent) as spent, SUM(clicks) as clicks, SUM(conversions) as conversions FROM advertising_campaigns WHERE user_id = ?${dateFilter}${marketplaceFilter} GROUP BY marketplace`
    ]

    const results = await Promise.all(
      queries.map(query => 
        new Promise((resolve, reject) => {
          db.all(query, params, (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
          })
        })
      )
    )

    const totalBudget = results[0][0]?.total_budget || 0
    const totalSpent = results[1][0]?.total_spent || 0
    const totalClicks = results[2][0]?.total_clicks || 0
    const totalImpressions = results[3][0]?.total_impressions || 0
    const totalConversions = results[4][0]?.total_conversions || 0

    res.json({
      totalBudget,
      totalSpent,
      totalClicks,
      totalImpressions,
      totalConversions,
      ctr: totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0,
      conversionRate: totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0,
      cpc: totalClicks > 0 ? (totalSpent / totalClicks) : 0,
      byMarketplace: results[5]
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения статистики рекламы' })
  }
})

// Создать рекламную кампанию
advertisingRouter.post('/campaigns', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { marketplace, external_id, name, type, status, budget, start_date, end_date } = req.body

    if (!marketplace || !external_id || !name || !type || !status) {
      return res.status(400).json({ error: 'Обязательные поля: marketplace, external_id, name, type, status' })
    }

    db.run(
      'INSERT INTO advertising_campaigns (user_id, marketplace, external_id, name, type, status, budget, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, marketplace, external_id, name, type, status, budget, start_date, end_date],
      function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ error: 'Кампания с таким ID уже существует' })
          }
          return res.status(500).json({ error: 'Ошибка создания кампании' })
        }

        res.status(201).json({ message: 'Кампания создана', id: this.lastID })
      }
    )
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Обновить статистику кампании
advertisingRouter.patch('/campaigns/:id/stats', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { spent, clicks, impressions, conversions } = req.body

    db.run(
      `UPDATE advertising_campaigns SET 
       spent = COALESCE(?, spent),
       clicks = COALESCE(?, clicks),
       impressions = COALESCE(?, impressions),
       conversions = COALESCE(?, conversions),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [spent, clicks, impressions, conversions, id, userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Ошибка обновления статистики кампании' })
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Кампания не найдена' })
        }

        res.json({ message: 'Статистика кампании обновлена' })
      }
    )
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// Получить эффективность кампаний
advertisingRouter.get('/performance', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id
    const { dateFrom, dateTo } = req.query

    let dateFilter = ''
    const params: any[] = [userId]

    if (dateFrom && dateTo) {
      dateFilter = ' AND created_at BETWEEN ? AND ?'
      params.push(dateFrom, dateTo)
    }

    const query = `
      SELECT 
        id,
        name,
        marketplace,
        type,
        budget,
        spent,
        clicks,
        impressions,
        conversions,
        CASE WHEN impressions > 0 THEN (clicks * 100.0 / impressions) ELSE 0 END as ctr,
        CASE WHEN clicks > 0 THEN (conversions * 100.0 / clicks) ELSE 0 END as conversion_rate,
        CASE WHEN clicks > 0 THEN (spent / clicks) ELSE 0 END as cpc,
        CASE WHEN conversions > 0 THEN (spent / conversions) ELSE 0 END as cpa
      FROM advertising_campaigns 
      WHERE user_id = ?${dateFilter}
      ORDER BY spent DESC
    `

    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка получения эффективности кампаний' })
      }

      res.json({ performance: rows })
    })
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default advertisingRouter