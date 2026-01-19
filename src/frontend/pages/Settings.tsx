import React, { useState } from 'react';
import {
  CogIcon,
  UserIcon,
  BuildingStorefrontIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface SettingsTab {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    companyName: 'ООО "МаркетПро"',
    companyInn: '1234567890',
    companyAddress: 'г. Москва, ул. Примерная, д. 1',
    companyPhone: '+7 (495) 123-45-67',
    companyEmail: 'info@company.ru',

    userName: 'Александр Администратор',
    userEmail: 'admin@company.ru',
    userPhone: '+7 (999) 123-45-67',

    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    stockNotifications: true,
    priceNotifications: false,

    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,

    theme: 'light',
    language: 'ru',
    dateFormat: 'dd.mm.yyyy',
    currency: 'RUB',

    autoSync: true,
    syncInterval: 15,

    autoBackup: true,
    backupInterval: 'daily',
    backupRetention: 30
  });

  const tabs: SettingsTab[] = [
    {
      id: 'general',
      name: 'Общие',
      icon: CogIcon,
      description: 'Параметры компании и реквизиты'
    },
    {
      id: 'profile',
      name: 'Профиль',
      icon: UserIcon,
      description: 'Данные пользователя и доступ'
    },
    {
      id: 'marketplaces',
      name: 'Маркетплейсы',
      icon: BuildingStorefrontIcon,
      description: 'Настройки интеграций и синхронизации'
    },
    {
      id: 'notifications',
      name: 'Уведомления',
      icon: BellIcon,
      description: 'Каналы и правила оповещений'
    },
    {
      id: 'security',
      name: 'Безопасность',
      icon: ShieldCheckIcon,
      description: 'Защита аккаунта и сессий'
    },
    {
      id: 'interface',
      name: 'Интерфейс',
      icon: PaintBrushIcon,
      description: 'Язык, валюта и формат дат'
    },
    {
      id: 'backup',
      name: 'Резервные копии',
      icon: CircleStackIcon,
      description: 'Автосохранение и хранение данных'
    }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о компании</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Название компании</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => handleSettingChange('companyName', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ИНН</label>
            <input
              type="text"
              value={settings.companyInn}
              onChange={(e) => handleSettingChange('companyInn', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Адрес</label>
            <input
              type="text"
              value={settings.companyAddress}
              onChange={(e) => handleSettingChange('companyAddress', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
            <input
              type="tel"
              value={settings.companyPhone}
              onChange={(e) => handleSettingChange('companyPhone', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings.companyEmail}
              onChange={(e) => handleSettingChange('companyEmail', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Контактные данные</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Имя пользователя</label>
            <input
              type="text"
              value={settings.userName}
              onChange={(e) => handleSettingChange('userName', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings.userEmail}
              onChange={(e) => handleSettingChange('userEmail', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
            <input
              type="tel"
              value={settings.userPhone}
              onChange={(e) => handleSettingChange('userPhone', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Пароль</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Текущий пароль</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Подтвердите пароль</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketplacesSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Состояние подключений</h3>
        <div className="space-y-4">
          {[
            { name: 'Wildberries', status: 'connected', lastSync: '21.07.2025 14:30' },
            { name: 'Ozon', status: 'connected', lastSync: '21.07.2025 14:25' },
            { name: 'Яндекс Маркет', status: 'error', lastSync: '21.07.2025 12:15' },
            { name: 'Мегамаркет', status: 'disconnected', lastSync: 'не подключен' }
          ].map((marketplace, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <BuildingStorefrontIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{marketplace.name}</h4>
                  <p className="text-sm text-gray-500">Последняя синхронизация: {marketplace.lastSync}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    marketplace.status === 'connected'
                      ? 'bg-green-100 text-green-800'
                      : marketplace.status === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {marketplace.status === 'connected' && <CheckIcon className="h-3 w-3 mr-1" />}
                  {marketplace.status === 'error' && (
                    <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                  )}
                  {marketplace.status === 'disconnected' && <XMarkIcon className="h-3 w-3 mr-1" />}
                  {marketplace.status === 'connected'
                    ? 'Подключено'
                    : marketplace.status === 'error'
                    ? 'Ошибка'
                    : 'Не подключено'}
                </span>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  {marketplace.status === 'connected' ? 'Переподключить' : 'Подключить'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Параметры синхронизации</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Автосинхронизация</label>
              <p className="text-sm text-gray-500">Регулярное обновление данных из маркетплейсов</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSync}
              onChange={(e) => handleSettingChange('autoSync', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Интервал синхронизации (мин)
            </label>
            <select
              value={settings.syncInterval}
              onChange={(e) => handleSettingChange('syncInterval', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5 минут</option>
              <option value={15}>15 минут</option>
              <option value={30}>30 минут</option>
              <option value={60}>1 час</option>
              <option value={180}>3 часа</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Каналы уведомлений</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Email уведомления</label>
              <p className="text-sm text-gray-500">Оповещения о важных событиях</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Push уведомления</label>
              <p className="text-sm text-gray-500">Уведомления в браузере</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">SMS уведомления</label>
              <p className="text-sm text-gray-500">Сообщения на телефон</p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">События уведомлений</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Новые заказы</label>
              <p className="text-sm text-gray-500">Оповещения о новых заказах</p>
            </div>
            <input
              type="checkbox"
              checked={settings.orderNotifications}
              onChange={(e) => handleSettingChange('orderNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Остатки на складе</label>
              <p className="text-sm text-gray-500">Снижение остатков и нули</p>
            </div>
            <input
              type="checkbox"
              checked={settings.stockNotifications}
              onChange={(e) => handleSettingChange('stockNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Изменение цен</label>
              <p className="text-sm text-gray-500">Уведомления при изменении цен</p>
            </div>
            <input
              type="checkbox"
              checked={settings.priceNotifications}
              onChange={(e) => handleSettingChange('priceNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Параметры безопасности</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Двухфакторная аутентификация</label>
              <p className="text-sm text-gray-500">Дополнительная защита аккаунта</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Тайм-аут сессии (мин)</label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={30}>30 минут</option>
              <option value={60}>1 час</option>
              <option value={120}>2 часа</option>
              <option value={480}>8 часов</option>
              <option value={1440}>24 часа</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Срок действия пароля (дни)
            </label>
            <select
              value={settings.passwordExpiry}
              onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={30}>30 дней</option>
              <option value={60}>60 дней</option>
              <option value={90}>90 дней</option>
              <option value={180}>180 дней</option>
              <option value={365}>1 год</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInterfaceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Настройки интерфейса</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Тема</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="light">Светлая</option>
              <option value="dark">Темная</option>
              <option value="auto">Автоматически</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Язык</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Формат даты</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="dd.mm.yyyy">ДД.ММ.ГГГГ</option>
              <option value="mm/dd/yyyy">ММ/ДД/ГГГГ</option>
              <option value="yyyy-mm-dd">ГГГГ-ММ-ДД</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Валюта</label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="RUB">Рубль (₽)</option>
              <option value="USD">Доллар ($)</option>
              <option value="EUR">Евро (€)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Автосохранение</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Автоматические резервные копии</label>
              <p className="text-sm text-gray-500">Регулярное сохранение базы</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Интервал резервного копирования
            </label>
            <select
              value={settings.backupInterval}
              onChange={(e) => handleSettingChange('backupInterval', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="hourly">Каждый час</option>
              <option value="daily">Каждый день</option>
              <option value="weekly">Каждую неделю</option>
              <option value="monthly">Каждый месяц</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Хранить копии (дни)</label>
            <select
              value={settings.backupRetention}
              onChange={(e) => handleSettingChange('backupRetention', parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={7}>7 дней</option>
              <option value={30}>30 дней</option>
              <option value={90}>90 дней</option>
              <option value={365}>1 год</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Управление копиями</h3>
        <div className="space-y-3">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            <CloudArrowUpIcon className="h-4 w-4 mr-2" />
            Создать резервную копию
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <CircleStackIcon className="h-4 w-4 mr-2" />
            Просмотреть копии
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'profile':
        return renderProfileSettings();
      case 'marketplaces':
        return renderMarketplacesSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'interface':
        return renderInterfaceSettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        <p className="text-sm text-gray-600 mt-1">Управляйте профилем, интеграциями и безопасностью</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon
                    className={`h-5 w-5 mr-3 ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  />
                  <div>
                    <div className="font-medium">{tab.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{tab.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6">{renderTabContent()}</div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Сбросить
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
