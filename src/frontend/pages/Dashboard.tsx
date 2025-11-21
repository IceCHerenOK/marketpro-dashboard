import React, { useEffect, useState } from 'react'
import { api } from '../utils/api'
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface Summary {
  revenue: number
  ordersCount: number
  avgOrderValue: number
  conversionRate: number
}

interface Order {
  id: number
  externalId: string
  createdAt: string
  customerName?: string
  totalAmount: number
  status: string
  marketplace: string
}

interface Product {
  id: number
  name: string
  sku?: string
  price: number
  stockQuantity: number
  marketplace: string
  status: string
}

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary>({
    revenue: 0,
    ordersCount: 0,
    avgOrderValue: 0,
    conversionRate: 0
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const [summaryRes, ordersRes, productsRes] = await Promise.all([
        api.analytics.getSummary(),
        api.orders.getAll({ limit: 5 }),
        api.products.getAll({ limit: 3 })
      ])

      setSummary(summaryRes)
      setOrders(ordersRes.orders || [])
      setProducts(productsRes.products || [])
    } catch (err) {
      console.error('Ошибка загрузки дашборда:', err)
      setError('Не удалось загрузить данные панели')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value || 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
      case 'processing':
        return <ClockIcon className="h-4 w-4 text-blue-500" />
      case 'shipped':
        return <ArrowPathIcon className="h-4 w-4 text-purple-500" />
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      new: 'Новый',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен'
    }
    return map[status] || status
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
        <h1 className="text-2xl font-bold text-gray-900">Обзор</h1>
        <p className="text-gray-600">Ключевые показатели по продажам и остаткам</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Выручка</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.revenue)}</p>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                в сравнении с прошлым периодом
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Количество заказов</p>
              <p className="text-2xl font-bold text-gray-900">{summary.ordersCount}</p>
              <div className="flex items-center text-sm text-blue-600">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                обновлено автоматически
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Средний чек</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.avgOrderValue)}</p>
              <div className="flex items-center text-sm text-gray-500">
                <ArrowDownIcon className="h-4 w-4 mr-1" />
                рассчитывается по заказам
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <CubeIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Конверсия</p>
              <p className="text-2xl font-bold text-gray-900">{summary.conversionRate.toFixed(2)}%</p>
              <div className="flex items-center text-sm text-gray-500">
                <ChartBarIcon className="h-4 w-4 mr-1" />
                новые данные появятся после интеграции
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Недавние заказы</h3>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Заказы не найдены</div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.externalId}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString('ru-RU')} · {order.marketplace}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      {getStatusIcon(order.status)}
                      <span className="ml-2">{getStatusText(order.status)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Товары в продаже</h3>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Товары не найдены</div>
          ) : (
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      SKU: {product.sku || '—'} · {product.marketplace}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                    <p className="text-sm text-gray-500">Остаток: {product.stockQuantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
