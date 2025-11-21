import React, { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface Summary {
  revenue: number
  ordersCount: number
  avgOrderValue: number
  conversionRate: number
}

interface ChartPoint {
  date: string
  value: number
}

interface MarketplacePoint {
  marketplace: string
  orders: number
  revenue: number
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('30d')
  const [summary, setSummary] = useState<Summary>({
    revenue: 0,
    ordersCount: 0,
    avgOrderValue: 0,
    conversionRate: 0
  })
  const [revenueData, setRevenueData] = useState<ChartPoint[]>([])
  const [ordersData, setOrdersData] = useState<ChartPoint[]>([])
  const [marketplaceData, setMarketplaceData] = useState<MarketplacePoint[]>([])

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [summaryRes, revenueRes, ordersRes, marketplaceRes] = await Promise.all([
        api.analytics.getSummary({ range: dateRange }),
        api.analytics.getRevenue({ range: dateRange }),
        api.analytics.getSales({ range: dateRange }),
        api.analytics.getMarketplaceBreakdown({ range: dateRange })
      ])

      setSummary(summaryRes)
      setRevenueData(revenueRes.data || [])
      setOrdersData(ordersRes.data || [])
      setMarketplaceData(marketplaceRes.data || [])
    } catch (err) {
      console.error('Ошибка загрузки аналитики:', err)
      setError('Не удалось загрузить аналитические данные')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value || 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-gray-600">Детальная статистика продаж и показателей</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="input-field w-auto"
          >
            <option value="7d">Последние 7 дней</option>
            <option value="30d">Последние 30 дней</option>
            <option value="90d">Последние 90 дней</option>
          </select>
          <button className="btn-secondary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-50 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Общая выручка</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.revenue)}</p>
              <p className="text-sm text-gray-500">Актуальные данные от API</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Количество заказов</p>
              <p className="text-2xl font-bold text-gray-900">{summary.ordersCount}</p>
              <p className="text-sm text-gray-500">Всего заказов за период</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Средний чек</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.avgOrderValue)}</p>
              <p className="text-sm text-gray-500">Расчет по заказам</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Конверсия</p>
              <p className="text-2xl font-bold text-gray-900">{summary.conversionRate.toFixed(2)}%</p>
              <p className="text-sm text-gray-500">Обновится после появления данных</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Динамика выручки</h3>
          <div className="h-64">
            {revenueData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">Нет данных</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Количество заказов</h3>
          <div className="h-64">
            {ordersData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">Нет данных</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Распределение по маркетплейсам</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            {marketplaceData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">Нет данных</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketplaceData.map(item => ({ name: item.marketplace, value: item.orders }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {marketplaceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-4">
            {marketplaceData.map(item => (
              <div key={item.marketplace} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.marketplace}</p>
                  <p className="text-sm text-gray-500">{item.orders} заказов</p>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
