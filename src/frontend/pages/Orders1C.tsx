import React, { useState } from 'react'

interface Order {
  id: string
  number: string
  date: string
  customer: string
  phone: string
  amount: number
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  marketplace: string
  items: number
  manager: string
}

export default function Orders1C() {
  const [selectedTab, setSelectedTab] = useState('list')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMarketplace, setFilterMarketplace] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const orders: Order[] = [
    {
      id: '1',
      number: '000000123',
      date: '21.07.2025 14:30',
      customer: 'Иванов Иван Иванович',
      phone: '+7 (999) 123-45-67',
      amount: 3450,
      status: 'new',
      marketplace: 'Wildberries',
      items: 2,
      manager: 'Администратор'
    },
    {
      id: '2',
      number: '000000124',
      date: '21.07.2025 13:15',
      customer: 'Петрова Анна Сергеевна',
      phone: '+7 (999) 234-56-78',
      amount: 1890,
      status: 'processing',
      marketplace: 'OZON',
      items: 1,
      manager: 'Администратор'
    },
    {
      id: '3',
      number: '000000125',
      date: '21.07.2025 12:45',
      customer: 'Сидоров Петр Александрович',
      phone: '+7 (999) 345-67-89',
      amount: 5670,
      status: 'shipped',
      marketplace: 'Яндекс Маркет',
      items: 3,
      manager: 'Администратор'
    },
    {
      id: '4',
      number: '000000126',
      date: '21.07.2025 11:20',
      customer: 'Козлова Мария Викторовна',
      phone: '+7 (999) 456-78-90',
      amount: 2340,
      status: 'delivered',
      marketplace: 'Wildberries',
      items: 1,
      manager: 'Администратор'
    },
    {
      id: '5',
      number: '000000127',
      date: '21.07.2025 10:10',
      customer: 'Морозов Алексей Дмитриевич',
      phone: '+7 (999) 567-89-01',
      amount: 4120,
      status: 'cancelled',
      marketplace: 'OZON',
      items: 2,
      manager: 'Администратор'
    }
  ]

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'new': return 'Новый'
      case 'processing': return 'В обработке'
      case 'shipped': return 'Отправлен'
      case 'delivered': return 'Доставлен'
      case 'cancelled': return 'Отменен'
      default: return status
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new': return '#ff8000'
      case 'processing': return '#0080ff'
      case 'shipped': return '#8000ff'
      case 'delivered': return '#008000'
      case 'cancelled': return '#ff0000'
      default: return 'var(--1c-text-primary)'
    }
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(order => order.id))
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesMarketplace = filterMarketplace === 'all' || order.marketplace === filterMarketplace
    const matchesSearch = searchQuery === '' || 
      order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesMarketplace && matchesSearch
  })

  return (
    <div>
      {/* Вкладки */}
      <div className="tabs-1c">
        <div 
          className={`tab-1c ${selectedTab === 'list' ? 'active' : ''}`}
          onClick={() => setSelectedTab('list')}
        >
          Список
        </div>
        <div 
          className={`tab-1c ${selectedTab === 'form' ? 'active' : ''}`}
          onClick={() => setSelectedTab('form')}
        >
          Форма
        </div>
        <div 
          className={`tab-1c ${selectedTab === 'reports' ? 'active' : ''}`}
          onClick={() => setSelectedTab('reports')}
        >
          Отчеты
        </div>
      </div>

      <div className="tab-content">
        {selectedTab === 'list' && (
          <div>
            {/* Панель фильтров */}
            <div className="form-1c" style={{ marginBottom: '8px', padding: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
                  <label className="form-label" style={{ width: '60px' }}>Поиск:</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Номер или клиент..."
                  />
                </div>
                
                <div className="form-group" style={{ margin: 0, minWidth: '150px' }}>
                  <label className="form-label" style={{ width: '50px' }}>Статус:</label>
                  <select 
                    className="form-input"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Все</option>
                    <option value="new">Новые</option>
                    <option value="processing">В обработке</option>
                    <option value="shipped">Отправленные</option>
                    <option value="delivered">Доставленные</option>
                    <option value="cancelled">Отмененные</option>
                  </select>
                </div>
                
                <div className="form-group" style={{ margin: 0, minWidth: '150px' }}>
                  <label className="form-label" style={{ width: '80px' }}>Маркетплейс:</label>
                  <select 
                    className="form-input"
                    value={filterMarketplace}
                    onChange={(e) => setFilterMarketplace(e.target.value)}
                  >
                    <option value="all">Все</option>
                    <option value="Wildberries">Wildberries</option>
                    <option value="OZON">OZON</option>
                    <option value="Яндекс Маркет">Яндекс Маркет</option>
                  </select>
                </div>
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                  <button className="button-1c primary">
                    <span className="icon-1c icon-document"></span>
                    Создать
                  </button>
                  <button className="button-1c">
                    <span className="icon-1c icon-table"></span>
                    Обновить
                  </button>
                  <button className="button-1c">
                    <span className="icon-1c icon-document"></span>
                    Печать
                  </button>
                </div>
              </div>
            </div>

            {/* Панель массовых действий */}
            {selectedOrders.length > 0 && (
              <div className="form-1c" style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#e1ecf7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
                    Выбрано: {selectedOrders.length} заказов
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="button-1c">Изменить статус</button>
                    <button className="button-1c">Печать документов</button>
                    <button className="button-1c">Экспорт</button>
                    <button className="button-1c" style={{ color: '#ff0000' }}>Удалить</button>
                  </div>
                </div>
              </div>
            )}

            {/* Таблица заказов */}
            <table className="table-1c">
              <thead>
                <tr>
                  <th style={{ width: '30px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ width: '100px' }}>Номер</th>
                  <th style={{ width: '130px' }}>Дата</th>
                  <th>Покупатель</th>
                  <th style={{ width: '120px' }}>Телефон</th>
                  <th style={{ width: '100px' }}>Сумма</th>
                  <th style={{ width: '100px' }}>Статус</th>
                  <th style={{ width: '120px' }}>Маркетплейс</th>
                  <th style={{ width: '60px' }}>Товаров</th>
                  <th style={{ width: '100px' }}>Менеджер</th>
                  <th style={{ width: '80px' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr 
                    key={order.id}
                    className={selectedOrders.includes(order.id) ? 'selected' : ''}
                  >
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="icon-1c icon-document"></span>
                        <span style={{ color: 'var(--1c-text-link)', cursor: 'pointer' }}>
                          {order.number}
                        </span>
                      </div>
                    </td>
                    <td>{order.date}</td>
                    <td>{order.customer}</td>
                    <td>{order.phone}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {order.amount.toLocaleString('ru-RU')} ₽
                    </td>
                    <td>
                      <span style={{ 
                        color: getStatusColor(order.status),
                        fontWeight: 'bold'
                      }}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td>{order.marketplace}</td>
                    <td style={{ textAlign: 'center' }}>{order.items}</td>
                    <td>{order.manager}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        <button 
                          className="button-1c" 
                          style={{ padding: '2px 4px', fontSize: '10px' }}
                          title="Открыть"
                        >
                          ↗
                        </button>
                        <button 
                          className="button-1c" 
                          style={{ padding: '2px 4px', fontSize: '10px' }}
                          title="Печать"
                        >
                          🖨
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Итоги */}
            <div className="form-1c" style={{ marginTop: '8px', padding: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '11px' }}>
                  Показано: {filteredOrders.length} из {orders.length} записей
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontWeight: 'bold' }}>
                  <span>
                    Общая сумма: {filteredOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString('ru-RU')} ₽
                  </span>
                  <span>
                    Товаров: {filteredOrders.reduce((sum, order) => sum + order.items, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'form' && (
          <div>
            <div className="form-1c">
              <h4 style={{ marginBottom: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                Заказ покупателя
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div className="form-group">
                    <label className="form-label">Номер:</label>
                    <input type="text" className="form-input" value="000000128" readOnly />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Дата:</label>
                    <input type="datetime-local" className="form-input" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Покупатель:</label>
                    <input type="text" className="form-input" placeholder="Введите ФИО..." />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Телефон:</label>
                    <input type="tel" className="form-input" placeholder="+7 (999) 123-45-67" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input type="email" className="form-input" placeholder="email@example.com" />
                  </div>
                </div>
                
                <div>
                  <div className="form-group">
                    <label className="form-label">Маркетплейс:</label>
                    <select className="form-input">
                      <option value="">Выберите маркетплейс</option>
                      <option value="wildberries">Wildberries</option>
                      <option value="ozon">OZON</option>
                      <option value="yandex_market">Яндекс Маркет</option>
                      <option value="megamarket">Мегамаркет</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Статус:</label>
                    <select className="form-input">
                      <option value="new">Новый</option>
                      <option value="processing">В обработке</option>
                      <option value="shipped">Отправлен</option>
                      <option value="delivered">Доставлен</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Менеджер:</label>
                    <select className="form-input">
                      <option value="admin">Администратор</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Сумма:</label>
                    <input type="number" className="form-input" placeholder="0.00" step="0.01" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Комментарий:</label>
                    <textarea className="form-input" rows={3} placeholder="Дополнительная информация..."></textarea>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button className="button-1c primary">Записать</button>
                <button className="button-1c">Записать и закрыть</button>
                <button className="button-1c">Печать</button>
                <button className="button-1c">Отмена</button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'reports' && (
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>
              Отчеты по заказам
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              <button className="button-1c" style={{ 
                padding: '12px', 
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: 'auto'
              }}>
                <span className="icon-1c icon-document"></span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Отчет по продажам</div>
                  <div style={{ fontSize: '10px', color: 'var(--1c-text-secondary)' }}>
                    Анализ продаж за период
                  </div>
                </div>
              </button>
              
              <button className="button-1c" style={{ 
                padding: '12px', 
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: 'auto'
              }}>
                <span className="icon-1c icon-table"></span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Статистика по статусам</div>
                  <div style={{ fontSize: '10px', color: 'var(--1c-text-secondary)' }}>
                    Распределение заказов по статусам
                  </div>
                </div>
              </button>
              
              <button className="button-1c" style={{ 
                padding: '12px', 
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: 'auto'
              }}>
                <span className="icon-1c icon-document"></span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Анализ по маркетплейсам</div>
                  <div style={{ fontSize: '10px', color: 'var(--1c-text-secondary)' }}>
                    Сравнение эффективности площадок
                  </div>
                </div>
              </button>
              
              <button className="button-1c" style={{ 
                padding: '12px', 
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: 'auto'
              }}>
                <span className="icon-1c icon-table"></span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Отчет по менеджерам</div>
                  <div style={{ fontSize: '10px', color: 'var(--1c-text-secondary)' }}>
                    Эффективность работы менеджеров
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}