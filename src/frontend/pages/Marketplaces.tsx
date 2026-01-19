import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Store, Settings, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Marketplace {
  id: string;
  name: string;
  logo: string;
  description: string;
  features: string[];
  connected: boolean;
  lastSync?: string;
}

export default function Marketplaces() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarketplace, setSelectedMarketplace] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    apiKey: '',
    clientId: '',
    secretKey: ''
  });

  useEffect(() => {
    fetchMarketplaces();
  }, []);

  const fetchMarketplaces = async () => {
    try {
      setLoading(true);
      const data = await api.marketplaces.getAll();

      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map((marketplace: any) => ({
          ...marketplace,
          connected: Boolean(marketplace.connected),
          lastSync: marketplace.lastSync ?? undefined
        }));
        setMarketplaces(normalized);
        return;
      }

      const mockMarketplaces = [
        {
          id: 'wildberries',
          name: 'Wildberries',
          logo: '/logos/wb.svg',
          description: 'Крупнейший маркетплейс России',
          features: ['orders', 'products', 'analytics', 'finance'],
          connected: Math.random() > 0.5,
          lastSync: new Date().toISOString()
        },
        {
          id: 'ozon',
          name: 'Ozon',
          logo: '/logos/ozon.svg',
          description: 'Один из крупнейших маркетплейсов',
          features: ['orders', 'products', 'analytics', 'advertising', 'finance'],
          connected: Math.random() > 0.5,
          lastSync: new Date().toISOString()
        },
        {
          id: 'yandex_market',
          name: 'Яндекс Маркет',
          logo: '/logos/yandex.svg',
          description: 'Маркетплейс от Яндекса',
          features: ['orders', 'products', 'analytics', 'advertising'],
          connected: Math.random() > 0.5
        },
        {
          id: 'megamarket',
          name: 'Мегамаркет',
          logo: '/logos/megamarket.svg',
          description: 'Маркетплейс от Сбер',
          features: ['orders', 'products'],
          connected: false
        },
        {
          id: 'magnitmarket',
          name: 'Магнит Маркет',
          logo: '/logos/magnitmarket.svg',
          description: 'Маркетплейс от Магнита',
          features: ['orders', 'products'],
          connected: false
        }
      ];

      setMarketplaces(mockMarketplaces);
    } catch (error) {
      console.error('Ошибка загрузки маркетплейсов:', error);
      setMarketplaces([
        {
          id: 'wildberries',
          name: 'Wildberries',
          logo: '/logos/wb.svg',
          description: 'Крупнейший маркетплейс России',
          features: ['orders', 'products', 'analytics', 'finance'],
          connected: false
        },
        {
          id: 'ozon',
          name: 'Ozon',
          logo: '/logos/ozon.svg',
          description: 'Один из крупнейших маркетплейсов',
          features: ['orders', 'products', 'analytics', 'advertising', 'finance'],
          connected: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (marketplaceId: string) => {
    try {
      await api.marketplaces.connect(marketplaceId, credentials);
      fetchMarketplaces();
      setSelectedMarketplace(null);
      setCredentials({ apiKey: '', clientId: '', secretKey: '' });
    } catch (error) {
      console.error('Ошибка подключения:', error);
    }
  };

  const handleSync = async (marketplaceId: string) => {
    try {
      await api.marketplaces.checkStatus(marketplaceId);
      fetchMarketplaces();
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    }
  };

  const getFeatureText = (feature: string) => {
    const featureMap: { [key: string]: string } = {
      orders: 'Заказы',
      products: 'Товары',
      analytics: 'Аналитика',
      advertising: 'Реклама',
      finance: 'Финансы'
    };
    return featureMap[feature] || feature;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Маркетплейсы</h1>
        <p className="text-gray-600">Подключайте интеграции и управляйте доступом к API</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaces.map((marketplace) => (
          <div key={marketplace.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <Store className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{marketplace.name}</h3>
                  <p className="text-sm text-gray-500">{marketplace.description}</p>
                </div>
              </div>
              {marketplace.connected ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Доступные функции:</p>
              <div className="flex flex-wrap gap-2">
                {marketplace.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {getFeatureText(feature)}
                  </span>
                ))}
              </div>
            </div>

            {marketplace.connected && marketplace.lastSync && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Последняя синхронизация: {new Date(marketplace.lastSync).toLocaleString('ru-RU')}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {marketplace.connected ? (
                <>
                  <button
                    onClick={() => handleSync(marketplace.id)}
                    className="btn-secondary flex items-center flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Синхронизировать
                  </button>
                  <button
                    onClick={() => setSelectedMarketplace(marketplace.id)}
                    className="btn-secondary flex items-center"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedMarketplace(marketplace.id)}
                  className="btn-primary flex-1"
                >
                  Подключить
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedMarketplace && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Подключить {marketplaces.find((mp) => mp.id === selectedMarketplace)?.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API ключ</label>
                <input
                  type="password"
                  value={credentials.apiKey}
                  onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                  className="input-field"
                  placeholder="Введите API ключ"
                />
              </div>

              {(selectedMarketplace === 'ozon' || selectedMarketplace === 'yandex_market') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
                  <input
                    type="text"
                    value={credentials.clientId}
                    onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
                    className="input-field"
                    placeholder="Введите Client ID"
                  />
                </div>
              )}

              {selectedMarketplace === 'yandex_market' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                  <input
                    type="password"
                    value={credentials.secretKey}
                    onChange={(e) => setCredentials({ ...credentials, secretKey: e.target.value })}
                    className="input-field"
                    placeholder="Введите Secret Key"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setSelectedMarketplace(null);
                  setCredentials({ apiKey: '', clientId: '', secretKey: '' });
                }}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button
                onClick={() => handleConnect(selectedMarketplace)}
                className="btn-primary"
                disabled={!credentials.apiKey}
              >
                Подключить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Как получить API ключи</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Wildberries</h4>
            <p className="text-sm text-gray-600">
              Откройте раздел «Доступ к API» в личном кабинете продавца и создайте ключ доступа.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Ozon</h4>
            <p className="text-sm text-gray-600">
              В личном кабинете продавца создайте API ключ и Client ID в разделе «Настройки API».
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Яндекс Маркет</h4>
            <p className="text-sm text-gray-600">
              Создайте OAuth приложение и получите Client ID / Secret Key для интеграции.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Мегамаркет и Магнит Маркет</h4>
            <p className="text-sm text-gray-600">
              Получите доступ к API через службу поддержки или в личном кабинете продавца.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
