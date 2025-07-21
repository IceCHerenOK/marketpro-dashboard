import React, { useState } from 'react'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface StatCard {
  title: string
  value: string
  change: number
  icon: React.ComponentType<any>
  color: string
}

interface Order {
  id: string
  number: string
  date: string
  customer: string
  amount: number
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  marketplace: string
}

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  sales: number
  marketplace: string
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [searchQuery, setSearchQuery] = useState('')

  const stats: StatCard[] = [
    {
      title: 'Выручка за сегодня',
      value: '₽ 245 890',
      change: 12.5,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Заказы',
      value: '127',
      change: 8.3,
      icon: ShoppingCartIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Товары в продаже',
      value: '1 234',
      change: -2.1,
      icon: CubeIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Средний чек',
      value: '₽ 1 937',
      change: 5.7,
      icon: ChartBarIcon,
      color: 'bg-orange-500'
    }
  ]

  const recentOrders: Order[] = [
    {
      id: '1',
      number: '000000123',
      date: '21.07.2025 14:30',
      customer: 'Иванов Иван Иванович',
      amount: 3450,
      status: 'new',
      marketplace: 'Wildberries'
    },
    {
      id: '2',
      number: '000000124',
      date: '21.07.2025 13:15',
      customer: 'Петрова Анна Сергеевна',
      amount: 1890,
      status: 'processing',
      marketplace: 'OZON'
    },
    {
      id: '3',
      number: '000000125',
      date: '21.07.2025 12:45',
      customer: 'Сидоров Петр Александрович',
      amount: 5670,
      status: 'shipped',
      marketplace: 'Яндекс Маркет'
    },
    {
      id: '4',
      number: '000000126',
      date: '21.07.2025 11:20',
      customer: 'Козлова Мария Викторовна',
      amount: 2340,
      status: 'delivered',
      marketplace: 'Wildberries'
    },
    {
      id: '5',
      number: '000000127',
      date: '21.07.2025 10:10',
      customer: 'Морозов Алексей Дмитриевич',
      amount: 4120,
      status: 'cancelled',
      marketplace: 'OZON'
    }
  ]

  const topProducts: Product[] = [
    {
      id: '1',
      name: 'Смартфон Samsung Galaxy A54 5G 128GB',
      sku: 'SM-A546B',
      price: 24990,
      stock: 45,
      sales: 23,
      marketplace: 'Wildberries'
    },
    {
      id: '2',
      name: 'Наушники Apple AirPods Pro 2-го поколения',
      sku: 'MTJV3',
      price: 19990,
      stock: 12,
      sales: 18,
      marketplace: 'OZON'
    },
    {
      id: '3',
      name: 'Ноутбук ASUS VivoBook 15 X1500EA',
      sku: 'X1500EA-BQ2491',
      price: 45990,
      stock: 8,
      sales: 12,
      marketplace: 'Яндекс Маркет'
    }
  ]

  const getStatusIcon = (status: Order['status']) => {
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

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return 'Новый'
      case 'processing':
        return 'В обработке'
      case 'shipped':
        return 'Отправлен'
      case 'delivered':
        return 'Доставлен'
      case 'cancelled':
        return 'Отменен'
      default:
        return status
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Рабочий стол</h1>
          <p className="text-sm text-gray-600 mt-1">
            Обзор основных показателей и последних операций
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="quarter">Квартал</option>
          </select>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Обновить
          </button>
        </div>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className={`flex items-center text-sm ${
                stat.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stat.change)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Последние заказы */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Заказы покупателей</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Поиск заказов..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <FunnelIcon className="h-4 w-4 mr-1" />
                    Фильтр
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Создать
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Номер
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Покупатель
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сумма
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Маркетплейс
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                          {order.number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.customer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.marketplace}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Показано 5 из 127 записей
                </div>
                <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Показать все заказы
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Популярные товары */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Популярные товары</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Все товары
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center mt-1 space-x-4">
                      <span className="text-xs text-gray-500">
                        Артикул: {product.sku}
                      </span>
                      <span className="text-xs text-gray-500">
                        Остаток: {product.stock}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium text-gray-900">
                        {product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        Продано: {product.sales}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <button className="w-full inline-flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                Перейти к номенклатуре
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Быстрые действия</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <PlusIcon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Новый заказ</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CubeIcon className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Добавить товар</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Отчеты</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <DocumentArrowDownIcon className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Экспорт</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CalendarIcon className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Планировщик</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Финансы</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}