import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  PhotoIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reserved: number;
  available: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  marketplace: string;
  brand: string;
  description: string;
  images: string[];
  lastUpdated: string;
  sales30d: number;
}

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const products: Product[] = [
    {
      id: '1',
      sku: 'SM-A546B-128-BLK',
      name: 'Смартфон Samsung Galaxy A54 5G 128GB, черный',
      category: 'Смартфоны',
      price: 24990,
      stock: 45,
      reserved: 3,
      available: 42,
      status: 'active',
      marketplace: 'Wildberries',
      brand: 'Samsung',
      description: 'Смартфон с экраном 6.4" и камерой 50 МП.',
      images: [],
      lastUpdated: '21.07.2025 14:30',
      sales30d: 23
    },
    {
      id: '2',
      sku: 'MTJV3-AIRPODS-PRO2',
      name: 'Наушники Apple AirPods Pro 2',
      category: 'Наушники',
      price: 19990,
      stock: 12,
      reserved: 2,
      available: 10,
      status: 'active',
      marketplace: 'Ozon',
      brand: 'Apple',
      description: 'Беспроводные наушники с шумоподавлением.',
      images: [],
      lastUpdated: '21.07.2025 13:15',
      sales30d: 18
    },
    {
      id: '3',
      sku: 'X1500EA-BQ2491',
      name: 'Ноутбук ASUS VivoBook 15 X1500EA',
      category: 'Ноутбуки',
      price: 45990,
      stock: 8,
      reserved: 1,
      available: 7,
      status: 'active',
      marketplace: 'Яндекс Маркет',
      brand: 'ASUS',
      description: 'Intel Core i5, SSD 512GB.',
      images: [],
      lastUpdated: '21.07.2025 12:45',
      sales30d: 12
    },
    {
      id: '4',
      sku: 'MI-BAND-7-BLK',
      name: 'Фитнес-браслет Xiaomi Mi Band 7',
      category: 'Фитнес-браслеты',
      price: 3490,
      stock: 0,
      reserved: 0,
      available: 0,
      status: 'out_of_stock',
      marketplace: 'Wildberries',
      brand: 'Xiaomi',
      description: 'AMOLED экран, мониторинг активности.',
      images: [],
      lastUpdated: '20.07.2025 16:20',
      sales30d: 25
    },
    {
      id: '5',
      sku: 'IPHONE-15-128-BLU',
      name: 'Смартфон Apple iPhone 15 128GB, синий',
      category: 'Смартфоны',
      price: 79990,
      stock: 25,
      reserved: 5,
      available: 20,
      status: 'inactive',
      marketplace: 'Ozon',
      brand: 'Apple',
      description: 'Новый iPhone с процессором A16 Bionic.',
      images: [],
      lastUpdated: '21.07.2025 11:30',
      sales30d: 8
    }
  ];

  const categories = [
    'Все категории',
    'Смартфоны',
    'Наушники',
    'Ноутбуки',
    'Фитнес-браслеты',
    'Аксессуары',
    'Электроника'
  ];

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'out_of_stock':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'inactive':
        return 'Неактивен';
      case 'out_of_stock':
        return 'Нет в наличии';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStockColor = (available: number, stock: number) => {
    if (available === 0) return 'text-red-600';
    if (available < stock * 0.2) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4" />
    ) : (
      <ChevronDownIcon className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Каталог товаров</h1>
          <p className="text-sm text-gray-600 mt-1">
            Управляйте карточками, ценами и остатками по маркетплейсам
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Выгрузить
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Импорт
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Добавить товар
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию, SKU, бренду..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                showFilters
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Фильтры
            </button>
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'table'
                    ? 'bg-blue-50 text-blue-700 border-r border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 border-r border-gray-300'
                }`}
              >
                Таблица
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'cards' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Карточки
              </button>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Обновить
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category === 'Все категории' ? 'all' : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Все статусы</option>
                    <option value="active">Активен</option>
                    <option value="inactive">Неактивен</option>
                    <option value="out_of_stock">Нет в наличии</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Маркетплейс</label>
                  <select
                    value={selectedMarketplace}
                    onChange={(e) => setSelectedMarketplace(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Все маркетплейсы</option>
                    <option value="wildberries">Wildberries</option>
                    <option value="ozon">Ozon</option>
                    <option value="yandex_market">Яндекс Маркет</option>
                    <option value="megamarket">Мегамаркет</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Остаток</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all">Все</option>
                    <option value="in_stock">В наличии</option>
                    <option value="low_stock">Низкий остаток</option>
                    <option value="out_of_stock">Нет в наличии</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'table' && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {selectedProducts.length > 0 && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Выбрано {selectedProducts.length} товаров</span>
                <div className="flex items-center space-x-2">
                  <button className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50">
                    Изменить статус
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50">
                    Обновить цены
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50">
                    Выгрузить
                  </button>
                  <button className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50">
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Фото
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sku')}
                  >
                    <div className="flex items-center">
                      SKU
                      <SortIcon field="sku" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Название
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категория
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Цена
                      <SortIcon field="price" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Остаток
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Маркетплейс
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {product.images[0] || <PhotoIcon className="h-6 w-6 text-gray-400" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {product.sku}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className={`font-medium ${getStockColor(product.available, product.stock)}`}>
                          Доступно: {product.available}
                        </div>
                        <div className="text-xs text-gray-500">
                          Всего: {product.stock} | Резерв: {product.reserved}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {getStatusIcon(product.status)}
                        <span className="ml-1">{getStatusText(product.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.marketplace}</div>
                      <div className="text-xs text-gray-500">Продажи за 30д: {product.sales30d}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="Посмотреть">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Редактировать">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Удалить">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">Показано 1-5 из 1 234 товаров</div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Предыдущая
                </button>
                <div className="flex items-center space-x-1">
                  <button className="px-3 py-1 border border-blue-500 rounded-md text-sm font-medium text-blue-600 bg-blue-50">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    3
                  </button>
                  <span className="px-2 text-gray-500">...</span>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    247
                  </button>
                </div>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Следующая
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
