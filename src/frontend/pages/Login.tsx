import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  Sun, 
  Moon,
  Store,
  ShoppingBag,
  BarChart3,
  Wallet
} from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Произошла ошибка при входе. Пожалуйста, попробуйте снова.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Переключатель темы */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div className="flex flex-1">
        {/* Левая часть - форма входа */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: 'var(--primary-gradient)' }}>
                  <Store className="h-6 w-6" />
                </div>
              </div>
              <h1 className="mt-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>MarketPro</h1>
              <h2 className="mt-2 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Вход в панель управления
              </h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Введите свои учетные данные для доступа к панели управления маркетплейсами
              </p>
            </div>
            
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-solid"
              style={{ borderColor: 'var(--card-border)' }}
            >
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} />
                      </div>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-solid focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ 
                          borderColor: 'var(--input-border)',
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--text-primary)'
                        }}
                        placeholder="Введите ваш email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Пароль
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="w-full pl-10 pr-10 py-2 rounded-lg border border-solid focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ 
                          borderColor: 'var(--input-border)',
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--text-primary)'
                        }}
                        placeholder="Введите ваш пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div 
                    className="px-4 py-3 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: 'var(--danger-light)',
                      color: 'var(--danger-color)'
                    }}
                  >
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-lg text-white font-medium flex items-center justify-center transition-all duration-200"
                    style={{ 
                      background: isLoading ? 'var(--text-tertiary)' : 'var(--primary-gradient)',
                      cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isLoading && (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    )}
                    {isLoading ? 'Вход...' : 'Войти'}
                  </button>
                </div>
              </form>
            </div>

            <div className="text-center">
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Для демонстрации используйте: <span className="font-medium">chubarov.a@azotstore.ru</span> / <span className="font-medium">icekenrok446</span>
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                © 2025 MarketPro. Все права защищены.
              </p>
            </div>
          </div>
        </div>
        
        {/* Правая часть - информация о продукте (только на десктопах) */}
        <div 
          className="hidden lg:flex lg:w-1/2 bg-cover bg-center items-center justify-center"
          style={{ 
            background: 'var(--primary-gradient)'
          }}
        >
          <div className="max-w-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Управляйте продажами на маркетплейсах эффективно</h2>
            <p className="text-lg mb-8 opacity-90">
              MarketPro — это комплексное решение для аналитики и управления продажами на всех популярных маркетплейсах России.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-white bg-opacity-20 flex items-center justify-center mr-4">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Управление заказами</h3>
                  <p className="text-sm opacity-80">Отслеживайте и управляйте заказами со всех маркетплейсов в одном месте</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-white bg-opacity-20 flex items-center justify-center mr-4">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Подробная аналитика</h3>
                  <p className="text-sm opacity-80">Получайте детальные отчеты о продажах, конверсии и эффективности рекламы</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-white bg-opacity-20 flex items-center justify-center mr-4">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Финансовый контроль</h3>
                  <p className="text-sm opacity-80">Контролируйте доходы, расходы и прибыльность вашего бизнеса</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;