import React from 'react';
import MarketplaceActionPanel from '../components/MarketplaceActionPanel';

export default function Sales() {
  return (
    <MarketplaceActionPanel
      title="Продажи"
      description="Отчеты по продажам и финансовым операциям на Ozon и WB."
      marketplaces={{
        ozon: {
          label: 'Ozon',
          actions: [
            {
              id: 'ozon-finance-transactions',
              name: 'Транзакции продаж',
              description: 'Список финансовых операций за период.',
              method: 'POST',
              path: '/v3/finance/transaction/list',
              defaultBody: {
                filter: {
                  date: {
                    from: '2024-01-01T00:00:00Z',
                    to: '2024-01-31T23:59:59Z'
                  }
                },
                page: 1,
                page_size: 50
              }
            },
            {
              id: 'ozon-finance-realization',
              name: 'Отчет по реализации',
              description: 'Детализация реализации за период.',
              method: 'POST',
              path: '/v2/finance/realization',
              defaultBody: {
                date_from: '2024-01-01',
                date_to: '2024-01-31'
              }
            }
          ]
        },
        wildberries: {
          label: 'Wildberries',
          actions: [
            {
              id: 'wb-sales',
              name: 'Продажи WB',
              description: 'Отчет по продажам WB.',
              method: 'GET',
              path: '/api/v1/supplier/sales',
              defaultParams: {
                dateFrom: '2024-01-01',
                dateTo: '2024-01-31'
              }
            }
          ]
        }
      }}
    />
  );
}
