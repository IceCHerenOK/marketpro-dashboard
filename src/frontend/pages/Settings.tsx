import React, { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { Save, Loader2, AlertCircle } from 'lucide-react'

interface SettingsForm {
  companyName: string
  companyInn: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  theme: 'light' | 'dark' | 'system'
  language: 'ru' | 'en'
  notifications: {
    orders: boolean
    finance: boolean
  }
}

const defaultSettings: SettingsForm = {
  companyName: '',
  companyInn: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  theme: 'system',
  language: 'ru',
  notifications: {
    orders: true,
    finance: true
  }
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsForm>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.settings.get()
      setSettings({ ...defaultSettings, ...(response.settings || {}) })
    } catch (err) {
      console.error('Ошибка загрузки настроек:', err)
      setError('Не удалось загрузить настройки')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof SettingsForm, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: keyof SettingsForm['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      setSaving(true)
      setStatusMessage(null)
      setError(null)
      await api.settings.update(settings)
      setStatusMessage('Настройки успешно сохранены')
    } catch (err) {
      console.error('Ошибка сохранения настроек:', err)
      setError('Не удалось сохранить настройки')
    } finally {
      setSaving(false)
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
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600">Укажите фактические данные вашей компании и предпочтения интерфейса</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {statusMessage && !error && (
        <div className="p-4 rounded-lg bg-green-50 text-green-700">{statusMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Данные компании</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Наименование организации</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={e => handleChange('companyName', e.target.value)}
                  className="input-field"
                  placeholder='ООО "Компания"'
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ИНН</label>
                <input
                  type="text"
                  value={settings.companyInn}
                  onChange={e => handleChange('companyInn', e.target.value)}
                  className="input-field"
                  placeholder="1234567890"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
                <input
                  type="text"
                  value={settings.companyAddress}
                  onChange={e => handleChange('companyAddress', e.target.value)}
                  className="input-field"
                  placeholder="г. Москва, ул. Примерная, д. 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                <input
                  type="tel"
                  value={settings.companyPhone}
                  onChange={e => handleChange('companyPhone', e.target.value)}
                  className="input-field"
                  placeholder="+7 (999) 000-00-00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.companyEmail}
                  onChange={e => handleChange('companyEmail', e.target.value)}
                  className="input-field"
                  placeholder="info@company.ru"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Интерфейс</h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тема</label>
              <select
                value={settings.theme}
                onChange={e => handleChange('theme', e.target.value as SettingsForm['theme'])}
                className="input-field"
              >
                <option value="light">Светлая</option>
                <option value="dark">Темная</option>
                <option value="system">Системная</option>
              </select>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Язык</h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">Интерфейс</label>
              <select
                value={settings.language}
                onChange={e => handleChange('language', e.target.value as SettingsForm['language'])}
                className="input-field"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Уведомления</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Новые заказы</p>
                  <p className="text-sm text-gray-500">Получать уведомления о поступлении заказов</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.orders}
                  onChange={e => handleNotificationChange('orders', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Финансовые события</p>
                  <p className="text-sm text-gray-500">Уведомления о выплатах и удержаниях</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.finance}
                  onChange={e => handleNotificationChange('finance', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={fetchSettings}
            disabled={saving}
          >
            Сбросить
          </button>
          <button type="submit" className="btn-primary flex items-center" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Сохранить
          </button>
        </div>
      </form>
    </div>
  )
}
