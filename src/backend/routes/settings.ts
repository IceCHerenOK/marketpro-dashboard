import express from 'express'
import authenticateToken from '../middleware/auth'

const settingsRouter = express.Router()

interface SettingsRecord {
  companyName: string
  companyInn: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  theme: string
  language: string
  notifications: {
    orders: boolean
    finance: boolean
  }
}

const defaultSettings: SettingsRecord = {
  companyName: '',
  companyInn: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  theme: 'system',
  language: 'ru',
  notifications: {
    orders: true,
    finance: true
  }
}

const settingsStore = new Map<number, SettingsRecord>()

settingsRouter.use(authenticateToken)

settingsRouter.get('/', (req: any, res: any) => {
  const userId = req.user.id
  const settings = settingsStore.get(userId) || defaultSettings
  res.json({ settings })
})

settingsRouter.put('/', (req: any, res: any) => {
  const userId = req.user.id
  const payload = req.body || {}

  const updated: SettingsRecord = {
    companyName: payload.companyName || '',
    companyInn: payload.companyInn || '',
    companyAddress: payload.companyAddress || '',
    companyPhone: payload.companyPhone || '',
    companyEmail: payload.companyEmail || '',
    theme: payload.theme || 'system',
    language: payload.language || 'ru',
    notifications: {
      orders: Boolean(payload.notifications?.orders),
      finance: Boolean(payload.notifications?.finance)
    }
  }

  settingsStore.set(userId, updated)
  res.json({ success: true, settings: updated })
})

export default settingsRouter
