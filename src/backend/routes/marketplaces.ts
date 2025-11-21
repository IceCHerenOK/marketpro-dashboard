import expressMarketplaces from 'express'
import authenticateToken from '../middleware/auth'

const marketplacesRouter = expressMarketplaces.Router()

const supportedMarketplaces = [
  {
    id: 'wildberries',
    name: 'Wildberries',
    logo: '/logos/wb.svg',
    description: 'Крупнейший российский маркетплейс',
    features: ['orders', 'products', 'analytics', 'advertising', 'finance']
  },
  {
    id: 'ozon',
    name: 'OZON',
    logo: '/logos/ozon.svg',
    description: 'Универсальный интернет-магазин',
    features: ['orders', 'products', 'analytics', 'advertising', 'finance']
  },
  {
    id: 'yandex_market',
    name: 'Яндекс Маркет',
    logo: '/logos/yandex.svg',
    description: 'Торговая площадка Яндекса',
    features: ['orders', 'products', 'analytics', 'finance']
  },
  {
    id: 'megamarket',
    name: 'Мегамаркет',
    logo: '/logos/megamarket.svg',
    description: 'Маркетплейс Сбера',
    features: ['orders', 'products', 'analytics']
  },
  {
    id: 'magnitmarket',
    name: 'Магнитмаркет',
    logo: '/logos/magnitmarket.svg',
    description: 'Маркетплейс Магнита',
    features: ['orders', 'products']
  }
]

type ConnectionRecord = {
  credentials: {
    apiKey?: string
    clientId?: string
    secretKey?: string
  }
  connectedAt: string
  lastSync?: string
}

const connections = new Map<string, ConnectionRecord>()

const getConnectionKey = (userId: number, marketplace: string) => `${userId}:${marketplace}`

marketplacesRouter.get('/', (_req, res) => {
  res.json(supportedMarketplaces)
})

marketplacesRouter.get('/supported', (_req, res) => {
  res.json(supportedMarketplaces)
})

marketplacesRouter.get('/:marketplace', (req, res) => {
  const marketplace = supportedMarketplaces.find(m => m.id === req.params.marketplace)
  if (!marketplace) {
    return res.status(404).json({ error: 'Маркетплейс не найден' })
  }

  res.json(marketplace)
})

marketplacesRouter.post('/:marketplace/connect', authenticateToken, (req: any, res: any) => {
  const { marketplace } = req.params
  const target = supportedMarketplaces.find(m => m.id === marketplace)

  if (!target) {
    return res.status(404).json({ error: 'Маркетплейс не найден' })
  }

  const { apiKey, clientId, secretKey } = req.body || {}
  const key = getConnectionKey(req.user.id, marketplace)

  connections.set(key, {
    credentials: { apiKey, clientId, secretKey },
    connectedAt: new Date().toISOString(),
    lastSync: undefined
  })

  res.json({
    success: true,
    marketplace,
    connectedAt: connections.get(key)?.connectedAt
  })
})

marketplacesRouter.post('/:marketplace/disconnect', authenticateToken, (req: any, res: any) => {
  const { marketplace } = req.params
  const key = getConnectionKey(req.user.id, marketplace)

  if (!connections.has(key)) {
    return res.status(404).json({ error: 'Подключение не найдено' })
  }

  connections.delete(key)
  res.json({ success: true, marketplace })
})

marketplacesRouter.get('/:marketplace/status', authenticateToken, (req: any, res: any) => {
  const { marketplace } = req.params
  const key = getConnectionKey(req.user.id, marketplace)
  const record = connections.get(key)

  res.json({
    marketplace,
    connected: Boolean(record),
    connectedAt: record?.connectedAt || null,
    lastSync: record?.lastSync || null
  })
})

marketplacesRouter.post('/:marketplace/sync', authenticateToken, (req: any, res: any) => {
  const { marketplace } = req.params
  const key = getConnectionKey(req.user.id, marketplace)
  const record = connections.get(key)

  if (!record) {
    return res.status(404).json({ error: 'Подключение не найдено' })
  }

  record.lastSync = new Date().toISOString()
  connections.set(key, record)

  res.json({ success: true, marketplace, lastSync: record.lastSync })
})

marketplacesRouter.post('/test-connection/:marketplace', authenticateToken, (req: any, res: any) => {
  const { marketplace } = req.params
  const target = supportedMarketplaces.find(m => m.id === marketplace)

  if (!target) {
    return res.status(400).json({ success: false, error: 'Неподдерживаемый маркетплейс' })
  }

  const { apiKey, clientId, secretKey } = req.body

  res.json({
    success: true,
    marketplace,
    received: {
      apiKey: Boolean(apiKey),
      clientId: Boolean(clientId),
      secretKey: Boolean(secretKey)
    }
  })
})

export default marketplacesRouter
