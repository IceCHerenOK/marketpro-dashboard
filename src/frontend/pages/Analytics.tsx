import React, { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [revenueData, setRevenueData] = useState([])
  const [ordersData, setOrdersData] = useState([])
  const [marketplaceData, setMarketplaceData] = useState([])

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      const [revenueRes, ordersRes, marketplaceRes] = await Promise.all([
        api.get('/analytics/charts', { params: { type: 'revenue' } }),
        api.get('/analytics/charts', { params: { type: 'orders' } }),
        api.get('/analytics/charts', { params: { type: 'products' } })
      ])

      setRevenueData(revenueRes.data.data || [])
      setOrdersData(ordersRes.data.data || [])
      setMarketplaceData(marketplaceRes.data.data || [])
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error)
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
          <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-gray-600">Детальная статистика продаж и показателей</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
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

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Общая выручка</p>
              <p className="text-2xl font-bold text-gray-900">₽2,450,000</p>
              <p className="text-sm text-green-600">+15.3% к прошлому периоду</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Средний чек</p>
              <p className="text-2xl font-bold text-gray-900">₽3,250</p>
              <p className="text-sm text-green-600">+8.7% к прошлому периоду</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Конверсия</p>
              <p className="text-2xl font-bold text-gray-900">12.4%</p>
              <p className="text-sm text-red-600">-2.1% к прошлому периоду</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">ROI рекламы</p>
              <p className="text-2xl font-bold text-gray-900">285%</p>
              <p className="text-sm text-green-600">+12.5% к прошлому периоду</p>
            </div>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График выручки */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Динамика выручки</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Выручка']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* График заказов */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Количество заказов</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Распределение по маркетплейсам */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Распределение продаж</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketplaceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ marketplace, percent }) => `${marketplace} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {marketplaceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Топ товары */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Топ товары по продажам</h3>
          <div className="space-y-4">
            {[
              { name: 'Смартфон iPhone 15', sales: 1250000, growth: 15.3 },
              { name: 'Наушники AirPods Pro', sales: 850000, growth: 8.7 },
              { name: 'Планшет iPad Air', sales: 650000, growth: -2.1 },
              { name: 'Умные часы Apple Watch', sales: 450000, growth: 12.4 },
              { name: 'Ноутбук MacBook Air', sales: 380000, growth: 5.8 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(item.sales)}</p>
                </div>
                <div className={`text-sm font-medium ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.growth > 0 ? '+' : ''}{item.growth}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Детальная таблица */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Детальная статистика по маркетплейсам</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Маркетплейс
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Выручка
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Заказы
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Средний чек
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Конверсия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Рост
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { marketplace: 'Wildberries', revenue: 1200000, orders: 450, avgOrder: 2667, conversion: 14.2, growth: 18.5 },
                { marketplace: 'OZON', revenue: 850000, orders: 320, avgOrder: 2656, conversion: 12.8, growth: 12.3 },
                { marketplace: 'Яндекс Маркет', revenue: 400000, orders: 150, avgOrder: 2667, conversion: 10.5, growth: 8.7 },
                { marketplace: 'Мегамаркет', revenue: 200000, orders: 80, avgOrder: 2500, conversion: 9.2, growth: -2.1 },
                { marketplace: 'Магнитмаркет', revenue: 150000, orders: 60, avgOrder: 2500, conversion: 8.5, growth: 5.4 }
              ].map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.marketplace}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(row.avgOrder)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.conversion}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${row.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.growth > 0 ? '+' : ''}{row.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}