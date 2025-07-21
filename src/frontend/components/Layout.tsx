import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  HomeIcon,
  ShoppingCartIcon,
  CubeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  CogIcon,
  BuildingStorefrontIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { 
    name: 'Рабочий стол', 
    href: '/dashboard', 
    icon: HomeIcon,
    description: 'Основная информация'
  },
  { 
    name: 'Продажи', 
    href: '/orders', 
    icon: ShoppingCartIcon,
    description: 'Заказы и продажи',
    children: [
      { name: 'Заказы покупателей', href: '/orders' },
      { name: 'Отчеты по продажам', href: '/sales-reports' }
    ]
  },
  { 
    name: 'Товары и услуги', 
    href: '/products', 
    icon: CubeIcon,
    description: 'Номенклатура',
    children: [
      { name: 'Номенклатура', href: '/products' },
      { name: 'Остатки товаров', href: '/inventory' },
      { name: 'Цены номенклатуры', href: '/prices' }
    ]
  },
  { 
    name: 'Отчеты', 
    href: '/analytics', 
    icon: ChartBarIcon,
    description: 'Аналитика и отчеты',
    children: [
      { name: 'Анализ продаж', href: '/analytics' },
      { name: 'ABC анализ', href: '/abc-analysis' },
      { name: 'Оборачиваемость', href: '/turnover' }
    ]
  },
  { 
    name: 'Деньги', 
    href: '/finance', 
    icon: CurrencyDollarIcon,
    description: 'Финансы',
    children: [
      { name: 'Движение денежных средств', href: '/finance' },
      { name: 'Взаиморасчеты', href: '/settlements' }
    ]
  },
  { 
    name: 'Маркетинг', 
    href: '/advertising', 
    icon: MegaphoneIcon,
    description: 'Реклама и продвижение',
    children: [
      { name: 'Рекламные кампании', href: '/advertising' },
      { name: 'Акции и скидки', href: '/promotions' }
    ]
  },
  { 
    name: 'Справочники', 
    href: '/marketplaces', 
    icon: BuildingStorefrontIcon,
    description: 'Маркетплейсы и контрагенты',
    children: [
      { name: 'Маркетплейсы', href: '/marketplaces' },
      { name: 'Контрагенты', href: '/counterparties' }
    ]
  },
  { 
    name: 'Администрирование', 
    href: '/settings', 
    icon: CogIcon,
    description: 'Настройки системы'
  },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isItemActive = (item: any) => {
    if (location.pathname === item.href) return true
    if (item.children) {
      return item.children.some((child: any) => location.pathname === child.href)
    }
    return false
  }

  const renderNavItem = (item: any) => {
    const isActive = isItemActive(item)
    const isExpanded = expandedItems.includes(item.name)
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.name} className="mb-1">
        <div className="flex items-center">
          <Link
            to={item.href}
            className={`${
              isActive
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            } group flex items-center px-3 py-2 text-sm font-medium flex-1 transition-colors duration-150`}
          >
            <item.icon
              className={`${
                isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
              } mr-3 h-5 w-5 flex-shrink-0`}
            />
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              {item.description && (
                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
              )}
            </div>
          </Link>
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.name)}
              className={`p-1 mr-2 rounded hover:bg-gray-100 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <ChevronDownIcon 
                className={`h-4 w-4 transform transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`} 
              />
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map((child: any) => (
              <Link
                key={child.name}
                to={child.href}
                className={`${
                  location.pathname === child.href
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } block px-3 py-1.5 text-sm rounded-sm transition-colors duration-150`}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">MP</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">MarketPro</h1>
                  <p className="text-xs text-gray-500">Управление торговлей</p>
                </div>
              </div>
            </div>
            <nav className="px-2 space-y-1">
              {navigation.map(renderNavItem)}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white shadow-sm">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold">MP</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">MarketPro</h1>
                    <p className="text-sm text-gray-500">Управление торговлей</p>
                  </div>
                </div>
              </div>
              <nav className="flex-1 px-2 bg-white space-y-1">
                {navigation.map(renderNavItem)}
              </nav>
            </div>
            
            {/* User info at bottom */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  title="Выйти"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar for mobile */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">MarketPro</h1>
          <div className="w-10"></div>
        </div>

        {/* Main content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}