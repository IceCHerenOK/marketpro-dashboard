import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  TruckIcon
} from '@heroicons/react/24/outline'

interface Order {
  id: number
  externalId: string
  createdAt: string
  customerName?: string
  totalAmount: number
  status: string
  marketplace: string
}

const statusLabels: Record<string, string> = {
  new: 'Новый',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменен'
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedMarketplace, setSelectedMarketplace] = useState('all')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.orders.getAll()
      setOrders(response.orders || [])
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err)
      setError('Не удалось загрузить заказы')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
      const matchesMarketplace =
        selectedMarketplace === 'all' || order.marketplace === selectedMarketplace
      const matchesSearch =
        !searchQuery ||
        order.externalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesMarketplace && matchesSearch
    })
  }, [orders, selectedStatus, selectedMarketplace, searchQuery])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(value || 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
      case 'processing':
        return <ClockIcon className="h-4 w-4 text-blue-500" />
      case 'shipped':
        return <TruckIcon className="h-4 w-4 text-purple-500" />
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4 text-red-500" />
      default:
        return null
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Заказы</h1>
          <p className="text-gray-600">Управление заказами с маркетплейсов</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center" onClick={loadOrders}>
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Обновить
          </button>
          <button className="btn-primary flex items-center">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700">{error}</div>
      )}

      <div className="card">
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="flex items-center flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск по номеру или покупателю"
              className="input-field"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">Все статусы</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={selectedMarketplace}
              onChange={e => setSelectedMarketplace(e.target.value)}
              className="input-field"
            >
              <option value="all">Все маркетплейсы</option>
              {[...new Set(orders.map(order => order.marketplace))].map(marketplace => (
                <option key={marketplace} value={marketplace}>
                  {marketplace}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Заказы не найдены</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заказ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Покупатель
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Маркетплейс
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{order.externalId}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{order.customerName || '—'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center px-2 py-1 rounded-full border text-xs font-medium bg-gray-50">
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{statusLabels[order.status] || order.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{order.marketplace}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
