import React from 'react';
import MarketplaceActionPanel from '../components/MarketplaceActionPanel';

export default function Orders() {
  return (
    <MarketplaceActionPanel
      title="Заказы"
      description="Единая панель управления заказами по Ozon и WB."
      marketplaces={{
        ozon: {
          label: 'Ozon',
          actions: [
            {
              id: 'ozon-fbs-list',
              name: 'FBS: список отправлений',
              description: 'Получить список заказов FBS с фильтрами.',
              method: 'POST',
              path: '/v3/posting/fbs/list',
              defaultBody: {
                filter: { since: '2024-01-01T00:00:00Z', to: '2024-01-31T23:59:59Z', status: '' },
                limit: 50,
                offset: 0
              }
            },
            {
              id: 'ozon-fbo-list',
              name: 'FBO: список отправлений',
              description: 'Получить список заказов FBO за период.',
              method: 'POST',
              path: '/v2/posting/fbo/list',
              defaultBody: {
                filter: { since: '2024-01-01T00:00:00Z', to: '2024-01-31T23:59:59Z' },
                limit: 50,
                offset: 0
              }
            },
            {
              id: 'ozon-fbs-get',
              name: 'FBS: получить отправление',
              description: 'Детали заказа по posting_number.',
              method: 'POST',
              path: '/v3/posting/fbs/get',
              defaultBody: {
                posting_number: ''
              }
            }
          ]
        },
        wildberries: {
          label: 'Wildberries',
          actions: [
            {
              id: 'wb-orders',
              name: 'Список заказов',
              description: 'Получить текущие заказы.',
              method: 'GET',
              path: '/api/v1/supplier/orders'
            }
          ]
        }
      }}
    />
  );
}
