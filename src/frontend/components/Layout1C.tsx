import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LineChart,
  LogOut,
  Megaphone,
  Menu,
  Moon,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Sun,
  Users,
  Wallet
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import '../styles/dashboard-layout.css'

type MenuItem = {
  id: string
  label: string
  icon?: LucideIcon
  path?: string
  badge?: string
  children?: MenuItem[]
}

const menuStructure: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Обзор',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    id: 'commerce',
    label: 'Продажи и каталог',
    icon: ShoppingBag,
    children: [
      { id: 'orders', label: 'Заказы', icon: ShoppingCart, path: '/orders' },
      { id: 'products', label: 'Товары', icon: Package, path: '/products' },
      { id: 'marketplaces', label: 'Маркетплейсы', icon: Store, path: '/marketplaces' }
    ]
  },
  {
    id: 'analytics',
    label: 'Аналитика',
    icon: LineChart,
    children: [
      { id: 'analytics-overview', label: 'Показатели', icon: LineChart, path: '/analytics' },
      { id: 'advertising', label: 'Реклама', icon: Megaphone, path: '/advertising', badge: 'новое' }
    ]
  },
  {
    id: 'finance',
    label: 'Финансы',
    icon: Wallet,
    path: '/finance'
  },
  {
    id: 'team',
    label: 'Команда и роли',
    icon: Users,
    badge: 'скоро'
  },
  {
    id: 'settings',
    label: 'Настройки',
    icon: Settings,
    path: '/settings'
  }
]

const pageDescriptions: Record<string, string> = {
  '/dashboard': 'Сводная панель с ключевыми метриками по продажам, остаткам и рекламным кампаниям на всех площадках.',
  '/orders': 'Управляйте заказами с маркетплейсов, отслеживайте статусы и контролируйте SLA-коммуникации.',
  '/products': 'Синхронизируйте каталог, обновляйте цены и остатки, следите за качеством карточек товаров.',
  '/analytics': 'Получайте отчетность по каналам продаж, разбивку по площадкам и выявляйте точки роста.',
  '/advertising': 'Контролируйте рекламные кампании, бюджеты и эффективность размещений на маркетплейсах.',
  '/finance': 'Анализируйте денежный поток, выплаты от площадок и маржинальность в разрезе SKU.',
  '/marketplaces': 'Управляйте подключениями маркетплейсов и настройками синхронизации данных.',
  '/settings': 'Настраивайте доступы команды, интеграции и системные параметры MarketPro.'
}

type FindResult = { item: MenuItem; parents: MenuItem[] }

const findItemByPath = (items: MenuItem[], path: string, parents: MenuItem[] = []): FindResult | null => {
  for (const item of items) {
    if (item.path === path) {
      return { item, parents }
    }

    if (item.children) {
      const match = findItemByPath(item.children, path, [...parents, item])
      if (match) {
        return match
      }
    }
  }

  return null
}

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout1C({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [expandedNodes, setExpandedNodes] = useState<string[]>(() =>
    menuStructure.filter(item => item.children).map(item => item.id)
  )
  const [selectedNode, setSelectedNode] = useState<string>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const match = findItemByPath(menuStructure, location.pathname)

    if (match) {
      setSelectedNode(match.item.id)
      if (match.parents.length) {
        setExpandedNodes(prev => {
          const next = new Set(prev)
          match.parents.forEach(parent => next.add(parent.id))
          return Array.from(next)
        })
      }
    }
  }, [location.pathname])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const currentSubtitle = useMemo(
    () => pageDescriptions[location.pathname] || 'Управляйте маркетплейсами, продажами и рекламой из единого окна.',
    [location.pathname]
  )

  const currentTitle = useMemo(() => {
    const match = findItemByPath(menuStructure, location.pathname)
    return match?.item.label ?? 'MarketPro'
  }, [location.pathname])

  const toggleSection = (id: string) => {
    setExpandedNodes(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    )
  }

  const handleNavigate = (item: MenuItem) => {
    if (!item.path) return
    setSelectedNode(item.id)
    navigate(item.path)
  }

  const renderSubItem = (item: MenuItem) => {
    const Icon = item.icon
    const isActive = location.pathname === item.path || selectedNode === item.id

    return (
      <button
        key={item.id}
        className={`nav-subitem ${isActive ? 'active' : ''}`}
        onClick={() => handleNavigate(item)}
      >
        {Icon && <Icon className="nav-subitem-icon" />}
        <span>{item.label}</span>
        {item.badge && <span className="nav-badge">{item.badge}</span>}
      </button>
    )
  }

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon
    const isExpanded = expandedNodes.includes(item.id)
    const isActive = selectedNode === item.id || location.pathname === item.path

    if (item.children) {
      return (
        <div key={item.id} className="nav-item">
          <button
            className={`nav-trigger ${isActive ? 'active' : ''}`}
            onClick={() => toggleSection(item.id)}
            aria-expanded={isExpanded}
          >
            <span className="nav-trigger-label">
              {Icon && <Icon className="nav-trigger-icon" />}
              <span>{item.label}</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
              <ChevronDown className={`nav-trigger-chevron ${isExpanded ? 'expanded' : ''}`} />
            </div>
          </button>
          {isExpanded && <div className="nav-submenu">{item.children.map(renderSubItem)}</div>}
        </div>
      )
    }

    return (
      <div key={item.id} className="nav-item">
        <button
          className={`nav-trigger ${isActive ? 'active' : ''}`}
          onClick={() => handleNavigate(item)}
          aria-current={isActive ? 'page' : undefined}
        >
          <span className="nav-trigger-label">
            {Icon && <Icon className="nav-trigger-icon" />}
            <span>{item.label}</span>
          </span>
          {item.badge && <span className="nav-badge">{item.badge}</span>}
        </button>
      </div>
    )
  }

  const userDisplayName = user?.username || user?.email || 'Пользователь'
  const userInitials = useMemo(() => {
    if (!userDisplayName) return 'MP'
    const parts = userDisplayName.split(/[\s@._-]+/).filter(Boolean)
    const initials = parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('')
    return initials || userDisplayName.charAt(0).toUpperCase()
  }, [userDisplayName])

  return (
    <div className="layout-shell">
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">MP</div>
          <div className="sidebar-title">
            <span>MarketPro</span>
            <span>Unified Commerce Hub</span>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-section-label">Навигация</span>
          {menuStructure.map(renderMenuItem)}
        </div>

        <div className="sidebar-footer">
          <span>Все данные синхронизированы</span>
          <span style={{ color: 'var(--text-tertiary)' }}>Обновлено {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </aside>

      <div className="layout-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-toggle"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="Открыть меню"
            >
              <Menu size={18} />
            </button>

            <div className="search-box">
              <Search className="search-icon" size={16} />
              <input type="search" placeholder="Поиск по товарам, заказам или отчётам" />
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-button" aria-label="Уведомления">
              <Bell size={18} />
            </button>
            <div className="user-chip">
              <div className="user-avatar">{userInitials}</div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>{userDisplayName}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Администратор</span>
              </div>
            </div>
            <button className="logout-button" onClick={logout}>
              <LogOut size={16} />
              <span>Выйти</span>
            </button>
          </div>
        </header>

        <main className="page-content-wrapper">
          <section className="page-header">
            <div className="page-header-top">
              <div>
                <h1 className="page-title">{currentTitle}</h1>
                <p className="page-subtitle">{currentSubtitle}</p>
              </div>
              <div className="page-actions">
                <button className="page-action-button">
                  <Sparkles size={16} />
                  <span>Быстрый отчёт</span>
                </button>
                <button className="page-action-button secondary">
                  <ShoppingBag size={16} />
                  <span>Новая синхронизация</span>
                </button>
              </div>
            </div>
          </section>

          <div className="page-body">{children}</div>
        </main>
      </div>
    </div>
  )
}
