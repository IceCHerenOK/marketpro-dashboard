import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  ClipboardList,
  FolderDown,
  FolderUp,
  Grid2X2,
  Layers,
  BookOpen,
  LayoutGrid,
  LogOut,
  Megaphone,
  Menu,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Store,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navSections = [
  {
    title: 'Обзор',
    items: [
      { to: '/dashboard', label: 'Рабочий стол', icon: LayoutGrid }
    ]
  },
  {
    title: 'Операции',
    items: [
      { to: '/orders', label: 'Заказы', icon: ShoppingCart },
      { to: '/sales', label: 'Продажи', icon: TrendingUp },
      { to: '/products', label: 'Товары', icon: Package },
      { to: '/prices', label: 'Цены', icon: Layers },
      { to: '/stocks', label: 'Остатки', icon: ClipboardList },
      { to: '/marketplaces', label: 'Маркетплейсы', icon: Store }
    ]
  },
  {
    title: 'Развитие',
    items: [
      { to: '/analytics', label: 'Аналитика', icon: BarChart3 },
      { to: '/finance', label: 'Финансы', icon: Wallet },
      { to: '/advertising', label: 'Реклама', icon: Megaphone }
    ]
  },
  {
    title: 'Настройки',
    items: [
      { to: '/settings', label: 'Настройки', icon: Settings }
    ]
  },
  {
    title: 'База знаний',
    items: [
      { to: '/knowledge-base', label: 'База знаний', icon: BookOpen }
    ]
  }
];

const buildTitleMap = () => {
  const map = new Map<string, string>();
  navSections.forEach((section) => {
    section.items.forEach((item) => map.set(item.to, item.label));
  });
  return map;
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const titleMap = useMemo(buildTitleMap, []);
  const pageTitle = titleMap.get(location.pathname) || 'Рабочий стол';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-gradient)] text-white shadow-md">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">MarketPro</div>
                <div className="text-xs text-[var(--text-tertiary)]">Командный центр</div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-6">
            {navSections.map((section) => (
              <div key={section.title} className="mb-6">
                <div className="px-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                  {section.title}
                </div>
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                          }`
                        }
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {sidebarOpen && (
          <button
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
        )}

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--header-bg)] px-6 py-4 backdrop-blur">
            <div className="flex items-center gap-4">
              <button
                className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <div className="text-sm text-[var(--text-tertiary)]">MarketPro</div>
                <div className="text-xl font-semibold">{pageTitle}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden text-sm text-[var(--text-secondary)] sm:block">
                {user?.username || user?.email || 'Пользователь'}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </button>
            </div>
          </header>

          <div className="command-bar">
            <div className="command-group">
              <button className="command-button">
                <Plus className="h-4 w-4" />
                Создать
              </button>
              <button className="command-button">
                <FolderUp className="h-4 w-4" />
                Импорт
              </button>
              <button className="command-button">
                <FolderDown className="h-4 w-4" />
                Экспорт
              </button>
            </div>
            <div className="command-group">
              <button className="command-button">
                <Grid2X2 className="h-4 w-4" />
                Вид
              </button>
              <button className="command-button">
                <ClipboardList className="h-4 w-4" />
                Отчеты
              </button>
            </div>
          </div>

          <main className="flex-1 px-6 pb-10 pt-8">
            <Outlet />
          </main>

          <footer className="status-bar">
            <span>Система готова</span>
            <span>MarketPro © {new Date().toLocaleDateString('ru-RU')}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}
