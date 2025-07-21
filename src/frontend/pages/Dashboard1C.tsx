import React, { useState } from 'react'

interface QuickAction {
  id: string
  name: string
  icon: string
  description: string
  action: () => void
}

interface RecentDocument {
  id: string
  name: string
  type: string
  date: string
  user: string
}

interface SystemInfo {
  label: string
  value: string
  status?: 'ok' | 'warning' | 'error'
}

export default function Dashboard1C() {
  const [selectedTab, setSelectedTab] = useState('overview')

  const quickActions: QuickAction[] = [
    {
      id: 'new-order',
      name: 'Заказ покупателя',
      icon: 'document',
      description: 'Создать новый заказ',
      action: () => console.log('Создать заказ')
    },
    {
      id: 'new-product',
      name: 'Номенклатура',
      icon: 'folder',
      description: 'Добавить товар',
      action: () => console.log('Добавить товар')
    },
    {
      id: 'inventory',
      name: 'Остатки товаров',
      icon: 'table',
      description: 'Просмотр остатков',
      action: () => console.log('Остатки')
    },
    {
      id: 'reports',
      name: 'Отчеты',
      icon: 'document',
      description: 'Формирование отчетов',
      action: () => console.log('Отчеты')
    },
    {
      id: 'cash-flow',
      name: 'Движение денежных средств',
      icon: 'table',
      description: 'Финансовые операции',
      action: () => console.log('Финансы')
    },
    {
      id: 'settings',
      name: 'Настройки',
      icon: 'folder',
      description: 'Параметры системы',
      action: () => console.log('Настройки')
    }
  ]

  const recentDocuments: RecentDocument[] = [
    {
      id: '1',
      name: 'Заказ покупателя №000000123 от 21.07.2025',
      type: 'Заказ покупателя',
      date: '21.07.2025 14:30',
      user: 'Администратор'
    },
    {
      id: '2',
      name: 'Поступление товаров №000000045 от 21.07.2025',
      type: 'Поступление товаров',
      date: '21.07.2025 13:15',
      user: 'Администратор'
    },
    {
      id: '3',
      name: 'Отчет по продажам за июль 2025',
      type: 'Отчет',
      date: '21.07.2025 12:00',
      user: 'Администратор'
    },
    {
      id: '4',
      name: 'Настройка интеграции с Wildberries',
      type: 'Настройка',
      date: '21.07.2025 11:45',
      user: 'Администратор'
    },
    {
      id: '5',
      name: 'Корректировка остатков №000000012',
      type: 'Корректировка',
      date: '21.07.2025 10:30',
      user: 'Администратор'
    }
  ]

  const systemInfo: SystemInfo[] = [
    { label: 'Версия конфигурации', value: 'MarketPro 1.0.0', status: 'ok' },
    { label: 'Версия платформы', value: '8.3.25.1257', status: 'ok' },
    { label: 'База данных', value: 'SQLite (локальная)', status: 'ok' },
    { label: 'Подключенные маркетплейсы', value: '2 из 4', status: 'warning' },
    { label: 'Последняя синхронизация', value: '21.07.2025 14:30', status: 'ok' },
    { label: 'Свободное место на диске', value: '45.2 ГБ', status: 'ok' }
  ]

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ok': return '#008000'
      case 'warning': return '#ff8000'
      case 'error': return '#ff0000'
      default: return 'var(--1c-text-primary)'
    }
  }

  return (
    <div>
      {/* Вкладки */}
      <div className="tabs-1c">
        <div 
          className={`tab-1c ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          Обзор
        </div>
        <div 
          className={`tab-1c ${selectedTab === 'actions' ? 'active' : ''}`}
          onClick={() => setSelectedTab('actions')}
        >
          Быстрые действия
        </div>
        <div 
          className={`tab-1c ${selectedTab === 'documents' ? 'active' : ''}`}
          onClick={() => setSelectedTab('documents')}
        >
          Последние документы
        </div>
        <div 
          className={`tab-1c ${selectedTab === 'system' ? 'active' : ''}`}
          onClick={() => setSelectedTab('system')}
        >
          Информация о системе
        </div>
      </div>

      <div className="tab-content">
        {selectedTab === 'overview' && (
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              Добро пожаловать в MarketPro!
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-1c">
                <h4 style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                  Сводка за сегодня
                </h4>
                <table className="table-1c">
                  <tbody>
                    <tr>
                      <td>Новых заказов</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>12</td>
                    </tr>
                    <tr>
                      <td>Сумма продаж</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>245 890 ₽</td>
                    </tr>
                    <tr>
                      <td>Обработано заказов</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>8</td>
                    </tr>
                    <tr>
                      <td>Товаров к отгрузке</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>23</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="form-1c">
                <h4 style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                  Требуют внимания
                </h4>
                <table className="table-1c">
                  <tbody>
                    <tr>
                      <td>Заказы к обработке</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#ff8000' }}>4</td>
                    </tr>
                    <tr>
                      <td>Товары с низким остатком</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#ff0000' }}>7</td>
                    </tr>
                    <tr>
                      <td>Просроченные задачи</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#ff0000' }}>2</td>
                    </tr>
                    <tr>
                      <td>Ошибки синхронизации</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#ff8000' }}>1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="form-1c">
              <h4 style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                Быстрый доступ
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {quickActions.slice(0, 4).map(action => (
                  <button 
                    key={action.id}
                    className="button-1c"
                    onClick={action.action}
                    style={{ 
                      padding: '8px 12px', 
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span className={`icon-1c icon-${action.icon}`}></span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{action.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--1c-text-secondary)' }}>
                        {action.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'actions' && (
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              Быстрые действия
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {quickActions.map(action => (
                <button 
                  key={action.id}
                  className="button-1c"
                  onClick={action.action}
                  style={{ 
                    padding: '12px', 
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: 'auto'
                  }}
                >
                  <span className={`icon-1c icon-${action.icon}`} style={{ width: '24px', height: '24px' }}></span>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{action.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--1c-text-secondary)' }}>
                      {action.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'documents' && (
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              Последние документы
            </h3>
            <table className="table-1c">
              <thead>
                <tr>
                  <th>Документ</th>
                  <th>Тип</th>
                  <th>Дата</th>
                  <th>Автор</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {recentDocuments.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="icon-1c icon-document"></span>
                        {doc.name}
                      </div>
                    </td>
                    <td>{doc.type}</td>
                    <td>{doc.date}</td>
                    <td>{doc.user}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="button-1c" style={{ padding: '2px 6px', fontSize: '10px' }}>
                          Открыть
                        </button>
                        <button className="button-1c" style={{ padding: '2px 6px', fontSize: '10px' }}>
                          Печать
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTab === 'system' && (
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              Информация о системе
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-1c">
                <h4 style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                  Система
                </h4>
                <table className="table-1c">
                  <tbody>
                    {systemInfo.map((info, index) => (
                      <tr key={index}>
                        <td>{info.label}</td>
                        <td style={{ 
                          textAlign: 'right', 
                          fontWeight: 'bold',
                          color: getStatusColor(info.status)
                        }}>
                          {info.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="form-1c">
                <h4 style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                  Статистика использования
                </h4>
                <table className="table-1c">
                  <tbody>
                    <tr>
                      <td>Документов создано сегодня</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>15</td>
                    </tr>
                    <tr>
                      <td>Отчетов сформировано</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>3</td>
                    </tr>
                    <tr>
                      <td>Время работы системы</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>2ч 15мин</td>
                    </tr>
                    <tr>
                      <td>Использование памяти</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>156 МБ</td>
                    </tr>
                    <tr>
                      <td>Размер базы данных</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>12.4 МБ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="button-1c primary">Проверить обновления</button>
                <button className="button-1c">Создать резервную копию</button>
                <button className="button-1c">Очистить временные файлы</button>
                <button className="button-1c">Журнал событий</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}