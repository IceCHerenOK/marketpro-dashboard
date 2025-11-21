import React, { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { Megaphone, Plus, BarChart3, Eye } from 'lucide-react'

interface Campaign {
  id: number
  name: string
  marketplace: string
  type: string
  status: string
  budget: number
  spent: number
  clicks: number
  impressions: number
  conversions: number
}

export default function Advertising() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState({
    totalBudget: 0,
    totalSpent: 0,
    totalClicks: 0,
    totalImpressions: 0,
    ctr: 0,
    conversionRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdvertisingData()
  }, [])

  const fetchAdvertisingData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [campaignsRes, statsRes] = await Promise.all([
        api.advertising.getCampaigns(),
        api.advertising.getStats()
      ])

      setCampaigns(campaignsRes.campaigns || [])
      setStats(statsRes)
    } catch (error) {
      console.error('Ошибка загрузки рекламных данных:', error)
      setError('Не удалось загрузить рекламные данные')
      setCampaigns([])
      setStats({
        totalBudget: 0,
        totalSpent: 0,
        totalClicks: 0,
        totalImpressions: 0,
        ctr: 0,
        conversionRate: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'stopped': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': 'Активная',
      'paused': 'Приостановлена',
      'stopped': 'Остановлена'
    }
    return statusMap[status] || status
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
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Реклама</h1>
          <p className="text-gray-600">Управление рекламными кампаниями</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Создать кампанию
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700">{error}</div>
      )}

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общий бюджет</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Megaphone className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Потрачено</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
              <p className="text-sm text-gray-500">
                {stats.totalBudget > 0 ? ((stats.totalSpent / stats.totalBudget) * 100).toFixed(1) : 0}% от бюджета
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CTR</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ctr.toFixed(2)}%</p>
              <p className="text-sm text-gray-500">{stats.totalClicks.toLocaleString()} кликов</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Конверсия</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(2)}%</p>
              <p className="text-sm text-gray-500">Из {stats.totalClicks.toLocaleString()} кликов</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Список кампаний */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Рекламные кампании ({campaigns.length})
          </h3>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Кампании не найдены</h3>
            <p className="text-gray-500">Создайте первую рекламную кампанию</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Кампания
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Маркетплейс
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Бюджет
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Потрачено
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клики
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CTR
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{campaign.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {campaign.marketplace}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(campaign.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(campaign.spent)}</div>
                      <div className="text-xs text-gray-500">
                        {campaign.budget > 0 ? ((campaign.spent / campaign.budget) * 100).toFixed(1) : 0}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : 0}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                        {getStatusText(campaign.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {campaign.status === 'active' ? (
                          <button className="text-yellow-600 hover:text-yellow-900">
                            <Pause className="h-4 w-4" />
                          </button>
                        ) : (
                          <button className="text-green-600 hover:text-green-900">
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Эффективность кампаний */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Топ кампании по эффективности</h3>
        <div className="space-y-4">
          {[
            { name: 'Смартфоны - Поиск', roi: 285, spent: 45000, revenue: 128250 },
            { name: 'Наушники - Каталог', roi: 220, spent: 32000, revenue: 70400 },
            { name: 'Планшеты - Рекомендации', roi: 180, spent: 28000, revenue: 50400 },
            { name: 'Аксессуары - Поиск', roi: 150, spent: 15000, revenue: 22500 }
          ].map((campaign, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{campaign.name}</p>
                <p className="text-sm text-gray-500">
                  Потрачено: {formatCurrency(campaign.spent)} • Выручка: {formatCurrency(campaign.revenue)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{campaign.roi}%</div>
                <div className="text-sm text-gray-500">ROI</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}