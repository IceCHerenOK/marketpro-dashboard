import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/1c-theme.css'

interface MenuItem {
  id: string
  name: string
  icon?: string
  children?: MenuItem[]
  path?: string
}

const menuStructure: MenuItem[] = [
  {
    id: 'desktop',
    name: 'Рабочий стол',
    icon: 'desktop',
    path: '/dashboard'
  },
  {
    id: 'sales',
    name: 'Продажи',
    icon: 'sales',
    children: [
      { id: 'orders', name: 'Заказы покупателей', path: '/orders' },
      { id: 'sales-reports', name: 'Отчеты по продажам', path: '/sales-reports' },
      { id: 'returns', name: 'Возвраты товаров', path: '/returns' }
    ]
  },
  {
    id: 'products',
    name: 'Товары и услуги',
    icon: 'products',
    children: [
      { id: 'nomenclature', name: 'Номенклатура', path: '/products' },
      { id: 'inventory', name: 'Остатки товаров', path: '/inventory' },
      { id: 'prices', name: 'Цены номенклатуры', path: '/prices' },
      { id: 'categories', name: 'Группы номенклатуры', path: '/categories' }
    ]
  },
  {
    id: 'reports',
    name: 'Отчеты',
    icon: 'reports',
    children: [
      { id: 'analytics', name: 'Анализ продаж', path: '/analytics' },
      { id: 'abc-analysis', name: 'ABC анализ', path: '/abc-analysis' },
      { id: 'turnover', name: 'Оборачиваемость', path: '/turnover' },
      { id: 'profitability', name: 'Рентабельность', path: '/profitability' }
    ]
  },
  {
    id: 'finance',
    name: 'Деньги',
    icon: 'finance',
    children: [
      { id: 'cash-flow', name: 'Движение денежных средств', path: '/finance' },
      { id: 'settlements', name: 'Взаиморасчеты', path: '/settlements' },
      { id: 'bank-operations', name: 'Банковские операции', path: '/bank-operations' }
    ]
  },
  {
    id: 'marketing',
    name: 'Маркетинг',
    icon: 'marketing',
    children: [
      { id: 'advertising', name: 'Рекламные кампании', path: '/advertising' },
      { id: 'promotions', name: 'Акции и скидки', path: '/promotions' },
      { id: 'loyalty', name: 'Программы лояльности', path: '/loyalty' }
    ]
  },
  {
    id: 'references',
    name: 'Справочники',
    icon: 'references',
    children: [
      { id: 'marketplaces', name: 'Маркетплейсы', path: '/marketplaces' },
      { id: 'counterparties', name: 'Контрагенты', path: '/counterparties' },
      { id: 'warehouses', name: 'Склады', path: '/warehouses' },
      { id: 'currencies', name: 'Валюты', path: '/currencies' }
    ]
  },
  {
    id: 'administration',
    name: 'Администрирование',
    icon: 'administration',
    children: [
      { id: 'settings', name: 'Настройки', path: '/settings' },
      { id: 'users', name: 'Пользователи', path: '/users' },
      { id: 'backup', name: 'Резервное копирование', path: '/backup' },
      { id: 'logs', name: 'Журнал событий', path: '/logs' }
    ]
  }
]

interface Layout1CProps {
  children: React.ReactNode
}

export default function Layout1C({ children }: Layout1CProps) {
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['sales', 'products', 'reports'])
  const [selectedNode, setSelectedNode] = useState<string>('desktop')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    )
  }

  const selectNode = (nodeId: string, path?: string) => {
    setSelectedNode(nodeId)
    if (path) {
      navigate(path)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const renderTreeNode = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedNodes.includes(item.id)
    const isSelected = selectedNode === item.id || location.pathname === item.path
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id}>
        <div 
          className={`tree-node ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 16 + 4}px` }}
          onClick={() => selectNode(item.id, item.path)}
        >
          {hasChildren && (
            <div 
              className={`tree-node-expand ${isExpanded ? 'expanded' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(item.id)
              }}
            />
          )}
          <div className={`tree-node-icon icon-${item.icon || 'folder'}`} />
          <span>{item.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className="tree-node-children">
            {item.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const getCurrentPageTitle = () => {
    const findTitle = (items: MenuItem[]): string => {
      for (const item of items) {
        if (item.path === location.pathname) {
          return item.name
        }
        if (item.children) {
          const childTitle = findTitle(item.children)
          if (childTitle) return childTitle
        }
      }
      return 'Рабочий стол'
    }
    return findTitle(menuStructure)
  }

  return (
    <div className="app-container">
      {/* Главное меню */}
      <div className="main-menu">
        <div className="menu-item" onClick={() => navigate('/dashboard')}>Файл</div>
        <div className="menu-item">Правка</div>
        <div className="menu-item">Вид</div>
        <div className="menu-item">Операции</div>
        <div className="menu-item">Отчеты</div>
        <div className="menu-item" onClick={() => navigate('/settings')}>Сервис</div>
        <div className="menu-item">Окно</div>
        <div className="menu-item">Справка</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--1c-text-secondary)' }}>
            {user?.username || user?.email}
          </span>
          <div className="menu-item" onClick={handleLogout}>Выход</div>
        </div>
      </div>

      {/* Панель инструментов */}
      <div className="toolbar">
        <button className="toolbar-button">
          <span className="icon-1c icon-document"></span>
          Создать
        </button>
        <button className="toolbar-button">
          <span className="icon-1c icon-folder"></span>
          Открыть
        </button>
        <button className="toolbar-button">
          <span className="icon-1c icon-table"></span>
          Записать
        </button>
        <div className="toolbar-separator"></div>
        <button className="toolbar-button">
          <span className="icon-1c icon-document"></span>
          Копировать
        </button>
        <button className="toolbar-button">
          <span className="icon-1c icon-document"></span>
          Вставить
        </button>
        <div className="toolbar-separator"></div>
        <button className="toolbar-button">
          <span className="icon-1c icon-table"></span>
          Найти
        </button>
        <button className="toolbar-button">
          <span className="icon-1c icon-document"></span>
          Печать
        </button>
        <div className="toolbar-separator"></div>
        <button className="toolbar-button">
          <span className="icon-1c icon-folder"></span>
          Обновить
        </button>
      </div>

      {/* Основная рабочая область */}
      <div className="main-content">
        {/* Левая панель навигации */}
        <div className="navigation-panel">
          <div className="navigation-header">
            Конфигурация
          </div>
          <div className="navigation-tree">
            {menuStructure.map(item => renderTreeNode(item))}
          </div>
        </div>

        {/* Рабочая область */}
        <div className="work-area">
          <div className="work-area-header">
            <div className="work-area-title">{getCurrentPageTitle()}</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className="button-1c">Действия</button>
              <button className="button-1c">Печать</button>
              <button className="button-1c">Еще</button>
            </div>
          </div>
          <div className="work-area-content">
            {children}
          </div>
        </div>
      </div>

      {/* Статусная строка */}
      <div className="status-bar">
        <div className="status-item">
          <span>Готов</span>
        </div>
        <div className="status-item">
          <span>MarketPro v1.0</span>
        </div>
        <div className="status-item">
          <span>{new Date().toLocaleString('ru-RU')}</span>
        </div>
      </div>
    </div>
  )
}