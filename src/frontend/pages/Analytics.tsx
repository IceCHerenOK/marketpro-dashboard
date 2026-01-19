import React from 'react';
import MarketplaceActionPanel from '../components/MarketplaceActionPanel';

export default function Analytics() {
  return (
    <MarketplaceActionPanel
      title="Аналитика"
      description="Сбор аналитических отчетов и метрик по складам, продажам и воронке."
      marketplaces={{
        ozon: {
          label: 'Ozon',
          actions: [
            {
              id: 'ozon-analytics-data',
              name: 'Аналитика данных',
              description: 'Сводная аналитика по товарам и продажам.',
              method: 'POST',
              path: '/v1/analytics/data',
              defaultBody: {
                date_from: '2024-01-01',
                date_to: '2024-01-31',
                metrics: ['ordered_units', 'delivered_units'],
                dimension: ['sku']
              }
            },
            {
              id: 'ozon-analytics-stocks',
              name: 'Остатки по складам',
              description: 'Аналитика остатков на складах.',
              method: 'POST',
              path: '/v1/analytics/stocks',
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
              id: 'wb-sales-funnel',
              name: 'Воронка продаж',
              description: 'Отчет по воронке продаж WB.',
              method: 'GET',
              path: '/api/analytics/v3/sales-funnel/products'
            },
            {
              id: 'wb-analytics-brand',
              name: 'Доли брендов',
              description: 'Отчет по долям брендов.',
              method: 'GET',
              path: '/api/v1/analytics/brand-share'
            }
          ]
        }
      }}
    />
  );
}
