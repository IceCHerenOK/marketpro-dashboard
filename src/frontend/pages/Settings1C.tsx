import React, { useState, useEffect } from 'react'

interface WildberriesSettings {
  apiKey: string
  supplierToken: string
  warehouseId: string
  autoSync: boolean
  syncInterval: number
}

interface OzonSettings {
  clientId: string
  apiKey: string
  warehouseId: string
  autoSync: boolean
}

interface YandexMarketSettings {
  oauthToken: string
  campaignId: string
  warehouseId: string
  autoSync: boolean
}

interface SystemSettings {
  language: string
  currency: string
  timezone: string
  autoBackup: boolean
  backupInterval: string
  logLevel: string
}

export default function Settings1C() {
  const [selectedTab, setSelectedTab] = useState('marketplaces')
  const [selectedMarketplace, setSelectedMarketplace] = useState('wildberries')
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null)

  const [wbSettings, setWbSettings] = useState<WildberriesSettings>({
    apiKey: '',
    supplierToken: '',
    warehouseId: '',
    autoSync: true,
    syncInterval: 15
  })

  const [ozonSettings, setOzonSettings] = useState<OzonSettings>({
    clientId: '',
    apiKey: '',
    warehouseId: '',
    autoSync: true
  })

  const [ymSettings, setYmSettings] = useState<YandexMarketSettings>({
    oauthToken: '',
    campaignId: '',
    warehouseId: '',
    autoSync: true
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    language: 'ru',
    currency: 'RUB',
    timezone: 'Europe/Moscow',
    autoBackup: true,
    backupInterval: 'daily',
    logLevel: 'info'
  })

  // Загрузка настроек при монтировании компонента
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setWbSettings(data.wildberries)
        setOzonSettings(data.ozon)
        setYmSettings(data.yandexMarket)
        setSystemSettings(data.system)
        console.log('Настройки загружены успешно')
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error)
    }
  }

  const saveSettings = async () => {
    try {
      const allSettings = {
        wildberries: wbSettings,
        ozon: ozonSettings,
        yandexMarket: ymSettings,
        system: systemSettings
      }

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(allSettings)
      })

      if (response.ok) {
        const result = await response.json()
        alert('Настройки сохранены успешно!')
        console.log('Настройки сохранены:', result)
      } else {
        throw new Error('Ошибка сохранения')
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error)
      alert('Ошибка сохранения настроек')
    }
  }

  const testConnection = async (marketplace: string) => {
    setTestingConnection(true)
    setConnectionStatus(null)

    try {
      let settings
      switch (marketplace) {
        case 'Wildberries':
          settings = wbSettings
          break
        case 'OZON':
          settings = ozonSettings
          break
        case 'Яндекс Маркет':
          settings = ymSettings
          break
        default:
          settings = {}
      }

      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ marketplace, settings })
      })

      if (response.ok) {
        const result = await response.json()
        setConnectionStatus(result.success ? 'success' : 'error')
        alert(result.message)
      } else {
        throw new Error('Ошибка тестирования')
      }
    } catch (error) {
      setConnectionStatus('error')
      alert('Ошибка тестирования подключения')
    } finally {
      setTestingConnection(false)
    }
  }

  const syncData = async (marketplace: string) => {
    try {
      const response = await fetch('/api/sync-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ marketplace })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`${result.message}\nСинхронизировано заказов: ${result.syncedOrders}\nСинхронизировано товаров: ${result.syncedProducts}`)
      } else {
        throw new Error('Ошибка синхронизации')
      }
    } catch (error) {
      alert('Ошибка синхронизации')
    }
  }

  const renderWildberriesSettings = () => (
    <div className="form-1c">
      <h4 style={{ marginBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}>
        Настройки Wildberries API
      </h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div className="form-group">
            <label className="form-label">API ключ:</label>
            <input 
              type="password" 
              className="form-input"
              value={wbSettings.apiKey}
              onChange={(e) => setWbSettings({...wbSettings, apiKey: e.target.value})}
              placeholder="Введите API ключ Wildberries"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Токен поставщика:</label>
            <input 
              type="password" 
              className="form-input"
              value={wbSettings.supplierToken}
              onChange={(e) => setWbSettings({...wbSettings, supplierToken: e.target.value})}
              placeholder="Токен из личного кабинета"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">ID склада:</label>
            <input 
              type="text" 
              className="form-input"
              value={wbSettings.warehouseId}
              onChange={(e) => setWbSettings({...wbSettings, warehouseId: e.target.value})}
              placeholder="Идентификатор склада"
            />
          </div>
        </div>
        
        <div>
          <div className="form-group">
            <label className="form-label">Автосинхронизация:</label>
            <input 
              type="checkbox" 
              checked={wbSettings.autoSync}
              onChange={(e) => setWbSettings({...wbSettings, autoSync: e.target.checked})}
            />
            <span style={{ marginLeft: '8px', fontSize: '11px' }}>
              Включить автоматическую синхронизацию
            </span>
          </div>
          
          <div className="form-group">
            <label className="form-label">Интервал (мин):</label>
            <select 
              className="form-input"
              value={wbSettings.syncInterval}
              onChange={(e) => setWbSettings({...wbSettings, syncInterval: parseInt(e.target.value)})}
            >
              <option value={5}>5 минут</option>
              <option value={15}>15 минут</option>
              <option value={30}>30 минут</option>
              <option value={60}>1 час</option>
              <option value={180}>3 часа</option>
            </select>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button 
                className="button-1c"
                onClick={() => testConnection('Wildberries')}
                disabled={testingConnection}
              >
                {testingConnection ? 'Тестирование...' : 'Тест подключения'}
              </button>
              <button 
                className="button-1c"
                onClick={() => syncData('Wildberries')}
              >
                Синхронизировать
              </button>
            </div>
            
            {connectionStatus && (
              <div style={{ 
                padding: '4px 8px', 
                fontSize: '10px',
                color: connectionStatus === 'success' ? '#008000' : '#ff0000',
                backgroundColor: connectionStatus === 'success' ? '#e8f5e8' : '#ffe8e8',
                border: `1px solid ${connectionStatus === 'success' ? '#008000' : '#ff0000'}`
              }}>
                {connectionStatus === 'success' ? 'Подключение успешно' : 'Ошибка подключения'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f0f8ff', border: '1px solid #d0e8ff' }}>
        <h5 style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}>
          Инструкция по получению API ключа:
        </h5>
        <ol style={{ fontSize: '10px', paddingLeft: '16px', margin: 0 }}>
          <li>Войдите в личный кабинет Wildberries</li>
          <li>Перейдите в раздел "Настройки" → "Доступ к API"</li>
          <li>Создайте новый токен с правами на чтение данных</li>
          <li>Скопируйте токен и вставьте в поле выше</li>
        </ol>
      </div>
    </div>
  )

  const renderOzonSettings = () => (
    <div className="form-1c">
      <h4 style={{ marginBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}>
        Настройки OZON API
      </h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div className="form-group">
            <label className="form-label">Client ID:</label>
            <input 
              type="text" 
              className="form-input"
              value={ozonSettings.clientId}
              onChange={(e) => setOzonSettings({...ozonSettings, clientId: e.target.value})}
              placeholder="Идентификатор клиента"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">API ключ:</label>
            <input 
              type="password" 
              className="form-input"
              value={ozonSettings.apiKey}
              onChange={(e) => setOzonSettings({...ozonSettings, apiKey: e.target.value})}
              placeholder="API ключ OZON"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">ID склада:</label>
            <input 
              type="text" 
              className="form-input"
              value={ozonSettings.warehouseId}
              onChange={(e) => setOzonSettings({...ozonSettings, warehouseId: e.target.value})}
              placeholder="Идентификатор склада"
            />
          </div>
        </div>
        
        <div>
          <div className="form-group">
            <label className="form-label">Автосинхронизация:</label>
            <input 
              type="checkbox" 
              checked={ozonSettings.autoSync}
              onChange={(e) => setOzonSettings({...ozonSettings, autoSync: e.target.checked})}
            />
            <span style={{ marginLeft: '8px', fontSize: '11px' }}>
              Включить автоматическую синхронизацию
            </span>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="button-1c"
                onClick={() => testConnection('OZON')}
                disabled={testingConnection}
              >
                {testingConnection ? 'Тестирование...' : 'Тест подключения'}
              </button>
              <button 
                className="button-1c"
                onClick={() => syncData('OZON')}
              >
                Синхронизировать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderYandexMarketSettings = () => (
    <div className="form-1c">
      <h4 style={{ marginBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}>
        Настройки Яндекс Маркет API
      </h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div className="form-group">
            <label className="form-label">OAuth токен:</label>
            <input 
              type="password" 
              className="form-input"
              value={ymSettings.oauthToken}
              onChange={(e) => setYmSettings({...ymSettings, oauthToken: e.target.value})}
              placeholder="OAuth токен"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">ID кампании:</label>
            <input 
              type="text" 
              className="form-input"
              value={ymSettings.campaignId}
              onChange={(e) => setYmSettings({...ymSettings, campaignId: e.target.value})}
              placeholder="Идентификатор кампании"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">ID склада:</label>
            <input 
              type="text" 
              className="form-input"
              value={ymSettings.warehouseId}
              onChange={(e) => setYmSettings({...ymSettings, warehouseId: e.target.value})}
              placeholder="Идентификатор склада"
            />
          </div>
        </div>
        
        <div>
          <div className="form-group">
            <label className="form-label">Автосинхронизация:</label>
            <input 
              type="checkbox" 
              checked={ymSettings.autoSync}
              onChange={(e) => setYmSettings({...ymSettings, autoSync: e.target.checked})}
            />
            <span style={{ marginLeft: '8px', fontSize: '11px' }}>
              Включить автоматическую синхронизацию
            </span>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="button-1c"
                onClick={() => testConnection('Яндекс Маркет')}
                disabled={testingConnection}
              >
                {testingConnection ? 'Тестирование...' : 'Тест подключения'}
              </button>
              <button 
                className="button-1c"
                onClick={() => syncData('Яндекс Маркет')}
              >
                Синхронизировать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="form-1c">
      <h4 style={{ marginBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}>
        Системные настройки
      </h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <div className="form-group">
            <label className="form-label">Язык интерфейса:</label>
            <select 
              className="form-input"
              value={systemSettings.language}
              onChange={(e) => setSystemSettings({...systemSettings, language: e.target.value})}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Валюта:</label>
            <select 
              className="form-input"
              value={systemSettings.currency}
              onChange={(e) => setSystemSettings({...systemSettings, currency: e.target.value})}
            >
              <option value="RUB">Рубль (₽)</option>
              <option value="USD">Доллар ($)</option>
              <option value="EUR">Евро (€)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Часовой пояс:</label>
            <select 
              className="form-input"
              value={systemSettings.timezone}
              onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
            >
              <option value="Europe/Moscow">Москва (UTC+3)</option>
              <option value="Europe/Samara">Самара (UTC+4)</option>
              <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
              <option value="Asia/Novosibirsk">Новосибирск (UTC+7)</option>
            </select>
          </div>
        </div>
        
        <div>
          <div className="form-group">
            <label className="form-label">Автоматическое резервное копирование:</label>
            <input 
              type="checkbox" 
              checked={systemSettings.autoBackup}
              onChange={(e) => setSystemSettings({...systemSettings, autoBackup: e.target.checked})}
            />
            <span style={{ marginLeft: '8px', fontSize: '11px' }}>
              Создавать резервные копии автоматически
            </span>
          </div>
          
          <div className="form-group">
            <label className="form-label">Интервал резервного копирования:</label>
            <select 
              className="form-input"
              value={systemSettings.backupInterval}
              onChange={(e) => setSystemSettings({...systemSettings, backupInterval: e.target.value})}
              disabled={!systemSettings.autoBackup}
            >
              <option value="hourly">Каждый час</option>
              <option value="daily">Ежедневно</option>
              <option value="weekly">Еженедельно</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Уровень логирования:</label>
            <select 
              className="form-input"
              value={systemSettings.logLevel}
              onChange={(e) => setSystemSettings({...systemSettings, logLevel: e.target.value})}
            >
              <option value="error">Только ошибки</option>
              <option value="warn">Предупреждения</option>
              <option value="info">Информация</option>
              <option value="debug">Отладка</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Вкладки */}
      <div className="tabs-1c">
        <div 
          className={`tab-1c ${selectedTab === 'marketplaces' ? 'active' : ''}`}
          onClick={() => setSelectedTab('marketplaces')}
        >
          Маркетплейсы
        </div>
        <div 
          className={`tab-1c ${selectedTab === 'system' ? 'active' : ''}`}
          onClick={() => setSelectedTab('system')}
        >
          Система
        </div>
        <div 
          className={`tab-1c ${selectedTab === 'backup' ? 'active' : ''}`}
          onClick={() => setSelectedTab('backup')}
        >
          Резервное копирование
        </div>
        <div 
          className={`tab-1c ${selectedTab === 'logs' ? 'active' : ''}`}
          onClick={() => setSelectedTab('logs')}
        >
          Журнал событий
        </div>
      </div>

      <div className="tab-content">
        {selectedTab === 'marketplaces' && (
          <div>
            {/* Подвкладки для маркетплейсов */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                <button 
                  className={`button-1c ${selectedMarketplace === 'wildberries' ? 'primary' : ''}`}
                  onClick={() => setSelectedMarketplace('wildberries')}
                >
                  Wildberries
                </button>
                <button 
                  className={`button-1c ${selectedMarketplace === 'ozon' ? 'primary' : ''}`}
                  onClick={() => setSelectedMarketplace('ozon')}
                >
                  OZON
                </button>
                <button 
                  className={`button-1c ${selectedMarketplace === 'yandex' ? 'primary' : ''}`}
                  onClick={() => setSelectedMarketplace('yandex')}
                >
                  Яндекс Маркет
                </button>
              </div>
              
              {selectedMarketplace === 'wildberries' && renderWildberriesSettings()}
              {selectedMarketplace === 'ozon' && renderOzonSettings()}
              {selectedMarketplace === 'yandex' && renderYandexMarketSettings()}
            </div>
          </div>
        )}

        {selectedTab === 'system' && renderSystemSettings()}

        {selectedTab === 'backup' && (
          <div className="form-1c">
            <h4 style={{ marginBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}>
              Управление резервными копиями
            </h4>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button className="button-1c primary">Создать резервную копию</button>
              <button className="button-1c">Восстановить из копии</button>
              <button className="button-1c">Очистить старые копии</button>
            </div>
            
            <table className="table-1c">
              <thead>
                <tr>
                  <th>Дата создания</th>
                  <th>Размер</th>
                  <th>Тип</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>21.07.2025 14:30</td>
                  <td>12.4 МБ</td>
                  <td>Автоматическая</td>
                  <td style={{ color: '#008000', fontWeight: 'bold' }}>Успешно</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="button-1c" style={{ padding: '2px 6px', fontSize: '10px' }}>
                        Восстановить
                      </button>
                      <button className="button-1c" style={{ padding: '2px 6px', fontSize: '10px' }}>
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>20.07.2025 14:30</td>
                  <td>11.8 МБ</td>
                  <td>Ручная</td>
                  <td style={{ color: '#008000', fontWeight: 'bold' }}>Успешно</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="button-1c" style={{ padding: '2px 6px', fontSize: '10px' }}>
                        Восстановить
                      </button>
                      <button className="button-1c" style={{ padding: '2px 6px', fontSize: '10px' }}>
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {selectedTab === 'logs' && (
          <div className="form-1c">
            <h4 style={{ marginBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}>
              Журнал событий системы
            </h4>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button className="button-1c">Обновить</button>
              <button className="button-1c">Очистить журнал</button>
              <button className="button-1c">Экспорт</button>
            </div>
            
            <table className="table-1c">
              <thead>
                <tr>
                  <th>Время</th>
                  <th>Уровень</th>
                  <th>Источник</th>
                  <th>Сообщение</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>21.07.2025 14:30:15</td>
                  <td style={{ color: '#008000', fontWeight: 'bold' }}>INFO</td>
                  <td>Wildberries API</td>
                  <td>Синхронизация заказов завершена успешно</td>
                </tr>
                <tr>
                  <td>21.07.2025 14:25:32</td>
                  <td style={{ color: '#ff8000', fontWeight: 'bold' }}>WARN</td>
                  <td>OZON API</td>
                  <td>Превышен лимит запросов, повтор через 60 секунд</td>
                </tr>
                <tr>
                  <td>21.07.2025 14:20:45</td>
                  <td style={{ color: '#ff0000', fontWeight: 'bold' }}>ERROR</td>
                  <td>Яндекс Маркет API</td>
                  <td>Ошибка авторизации: недействительный токен</td>
                </tr>
                <tr>
                  <td>21.07.2025 14:15:12</td>
                  <td style={{ color: '#008000', fontWeight: 'bold' }}>INFO</td>
                  <td>Система</td>
                  <td>Создана резервная копия базы данных</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Кнопки сохранения */}
      <div style={{ 
        marginTop: '16px', 
        padding: '8px', 
        borderTop: '1px solid var(--1c-border-light)',
        display: 'flex', 
        gap: '8px',
        justifyContent: 'flex-end'
      }}>
        <button className="button-1c primary" onClick={saveSettings}>
          Записать и закрыть
        </button>
        <button className="button-1c" onClick={saveSettings}>
          Записать
        </button>
        <button className="button-1c">
          Отмена
        </button>
      </div>
    </div>
  )
}