import React, { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { Store, CheckCircle, XCircle, RefreshCw, AlertCircle } from 'lucide-react'

interface Marketplace {
  id: string
  name: string
  logo: string
  description: string
  features: string[]
  connected: boolean
  lastSync?: string | null
}

const featureMap: Record<string, string> = {
  orders: 'Заказы',
  products: 'Товары',
  analytics: 'Аналитика',
  advertising: 'Реклама',
  finance: 'Финансы'
}

export default function Marketplaces() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMarketplace, setSelectedMarketplace] = useState<string | null>(null)
  const [credentials, setCredentials] = useState({
    apiKey: '',
    clientId: '',
    secretKey: ''
  })
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchMarketplaces()
  }, [])

  const fetchMarketplaces = async () => {
    try {
      setLoading(true)
      setError(null)

      const list = await api.marketplaces.getAll()
      const statuses = await Promise.all(
        list.map(async (marketplace: Marketplace) => {
          try {
            const status = await api.marketplaces.checkStatus(marketplace.id)
            return {
              ...marketplace,
              connected: Boolean(status.connected),
              lastSync: status.lastSync || null
            }
          } catch {
            return { ...marketplace, connected: false, lastSync: null }
          }
        })
      )

      setMarketplaces(statuses)
    } catch (err) {
      console.error('Ошибка загрузки маркетплейсов:', err)
      setError('Не удалось загрузить список маркетплейсов')
      setMarketplaces([])
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (marketplaceId: string) => {
    try {
      setActionMessage(null)
      await api.marketplaces.connect(marketplaceId, credentials)
      setCredentials({ apiKey: '', clientId: '', secretKey: '' })
      setSelectedMarketplace(null)
      setActionMessage('Подключение успешно отправлено')
      fetchMarketplaces()
    } catch (err) {
      console.error('Ошибка подключения:', err)
      setActionMessage('Не удалось подключить маркетплейс')
    }
  }

  const handleSync = async (marketplaceId: string) => {
    try {
      setActionMessage(null)
      await api.marketplaces.sync(marketplaceId)
      setActionMessage('Синхронизация запущена')
      fetchMarketplaces()
    } catch (err) {
      console.error('Ошибка синхронизации:', err)
      setActionMessage('Не удалось запустить синхронизацию')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Маркетплейсы</h1>
        <p className="text-gray-600">Настройка подключений к торговым площадкам</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {actionMessage && !error && (
        <div className="p-4 rounded-lg bg-blue-50 text-blue-700">
          {actionMessage}
        </div>
      )}

      {marketplaces.length === 0 ? (
        <div className="card text-center py-12">
          <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Нет доступных маркетплейсов</h3>
          <p className="text-gray-500">Поддерживаемые интеграции будут отображаться после подключения</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplaces.map(marketplace => (
            <div key={marketplace.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <Store className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{marketplace.name}</h3>
                    <p className="text-sm text-gray-500">{marketplace.description}</p>
                  </div>
                </div>
                {marketplace.connected ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Доступные функции:</p>
                <div className="flex flex-wrap gap-2">
                  {marketplace.features.map(feature => (
                    <span
                      key={feature}
                      className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {featureMap[feature] || feature}
                    </span>
                  ))}
                </div>
              </div>

              {marketplace.connected ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    {marketplace.lastSync
                      ? `Последняя синхронизация: ${new Date(marketplace.lastSync).toLocaleString('ru-RU')}`
                      : 'Синхронизация еще не выполнялась'}
                  </p>
                  <button
                    className="btn-secondary flex items-center justify-center"
                    onClick={() => handleSync(marketplace.id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Синхронизировать
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    className="btn-primary w-full"
                    onClick={() => setSelectedMarketplace(
                      selectedMarketplace === marketplace.id ? null : marketplace.id
                    )}
                  >
                    Настроить подключение
                  </button>
                  {selectedMarketplace === marketplace.id && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={credentials.apiKey}
                        onChange={e => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="API ключ"
                        className="input-field"
                      />
                      <input
                        type="text"
                        value={credentials.clientId}
                        onChange={e => setCredentials(prev => ({ ...prev, clientId: e.target.value }))}
                        placeholder="Client ID"
                        className="input-field"
                      />
                      <input
                        type="password"
                        value={credentials.secretKey}
                        onChange={e => setCredentials(prev => ({ ...prev, secretKey: e.target.value }))}
                        placeholder="Secret key"
                        className="input-field"
                      />
                      <button
                        className="btn-secondary w-full"
                        onClick={() => handleConnect(marketplace.id)}
                      >
                        Подключить
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
