import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: number
  externalId: string
  name: string
  sku?: string
  category?: string
  price: number
  stockQuantity: number
  marketplace: string
  status: 'active' | 'inactive' | 'out_of_stock' | string
}

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Активен', color: 'bg-green-100 text-green-700' },
  inactive: { label: 'Неактивен', color: 'bg-yellow-100 text-yellow-700' },
  out_of_stock: { label: 'Нет в наличии', color: 'bg-red-100 text-red-700' }
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedMarketplace, setSelectedMarketplace] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.products.getAll()
      setProducts(response.products || [])
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err)
      setError('Не удалось загрузить товары')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
      const matchesMarketplace =
        selectedMarketplace === 'all' || product.marketplace === selectedMarketplace
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku || '').toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesMarketplace && matchesSearch
    })
  }, [products, selectedStatus, selectedMarketplace, searchQuery])

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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
          <p className="text-gray-600">Список товаров, полученных из маркетплейсов</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center" onClick={loadProducts}>
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Обновить
          </button>
          <button className="btn-primary flex items-center">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-50 text-red-700">{error}</div>}

      <div className="card">
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="flex items-center flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или SKU"
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
              {Object.entries(statusLabels).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
            <select
              value={selectedMarketplace}
              onChange={e => setSelectedMarketplace(e.target.value)}
              className="input-field"
            >
              <option value="all">Все маркетплейсы</option>
              {[...new Set(products.map(product => product.marketplace))].map(marketplace => (
                <option key={marketplace} value={marketplace}>
                  {marketplace}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Товары не найдены</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Товар
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категория
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Остаток
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Маркетплейс
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">ID: {product.externalId}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{product.sku || '—'}</td>
                    <td className="px-4 py-3 text-gray-900">{product.category || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{product.stockQuantity}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          statusLabels[product.status]?.color || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {product.status === 'active' && (
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                        )}
                        {product.status === 'inactive' && (
                          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        )}
                        {product.status === 'out_of_stock' && (
                          <XCircleIcon className="h-4 w-4 mr-1" />
                        )}
                        {statusLabels[product.status]?.label || product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900">{product.marketplace}</td>
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
