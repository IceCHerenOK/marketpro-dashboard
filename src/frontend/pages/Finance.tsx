import React, { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Plus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Transaction {
  id: number
  marketplace: string
  transactionType: string
  amount: number
  description: string
  transactionDate: string
}

interface FinanceSummary {
  totalIncome: number
  totalExpenses: number
  netProfit: number
  trend: { date: string; income: number; expenses: number; profit: number }[]
}

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<FinanceSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    trend: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('30d')

  useEffect(() => {
    fetchFinanceData()
  }, [dateRange])

  const fetchFinanceData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [transactionsRes, summaryRes] = await Promise.all([
        api.finance.getTransactions({ range: dateRange }),
        api.finance.getSummary({ range: dateRange })
      ])

      setTransactions(transactionsRes.transactions || [])
      setSummary(summaryRes)
    } catch (err) {
      console.error('Ошибка загрузки финансовых данных:', err)
      setError('Не удалось загрузить финансовые данные')
      setTransactions([])
      setSummary({ totalIncome: 0, totalExpenses: 0, netProfit: 0, trend: [] })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(value || 0)
  }

  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString('ru-RU') : '—'
  }

  const getTransactionTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      sale: 'Продажа',
      commission: 'Комиссия',
      advertising: 'Реклама',
      logistics: 'Логистика',
      refund: 'Возврат',
      penalty: 'Штраф'
    }
    return typeMap[type] || type
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Финансы</h1>
          <p className="text-gray-600">Управление доходами, расходами и прибылью</p>
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
          <button className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Добавить транзакцию
          </button>
        </div>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-50 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общий доход</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalIncome)}</p>
              <div className="flex items-center mt-1 text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                Обновлено автоматически
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общие расходы</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalExpenses)}</p>
              <div className="flex items-center mt-1 text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                Учтены комиссии и логистика
              </div>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Чистая прибыль</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.netProfit)}</p>
              <div className="flex items-center mt-1 text-blue-600">
                <Calendar className="h-4 w-4 mr-1" />
                За выбранный период
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Динамика прибыли</h3>
        <div className="h-64">
          {summary.trend.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">Недостаточно данных</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="income" stroke="#10B981" name="Доходы" />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Расходы" />
                <Line type="monotone" dataKey="profit" stroke="#3B82F6" name="Прибыль" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Последние транзакции ({transactions.length})
          </h3>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Транзакции не найдены</h3>
            <p className="text-gray-500">Данные появятся после синхронизации</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Описание
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getTransactionTypeText(transaction.transactionType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
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
