import React from 'react';
import MarketplaceActionPanel from '../components/MarketplaceActionPanel';

export default function Stocks() {
  return (
    <MarketplaceActionPanel
      title="Остатки"
      description="Контроль остатков на складах и актуализация доступных количеств."
      marketplaces={{
        ozon: {
          label: 'Ozon',
          actions: [
            {
              id: 'ozon-stocks-info',
              name: 'Остатки по товарам',
              description: 'Получить остатки по складам и товарам.',
              method: 'POST',
              path: '/v4/product/info/stocks',
              defaultBody: {
                filter: { offer_id: [], product_id: [] },
                limit: 50,
                last_id: ''
              }
            },
            {
              id: 'ozon-stocks-update',
              name: 'Импорт остатков',
              description: 'Обновить остатки по SKU.',
              method: 'POST',
              path: '/v2/products/stocks',
              defaultBody: {
                stocks: [
                  {
                    offer_id: '',
                    stock: 0,
                    warehouse_id: 0
                  }
                ]
              }
            }
          ]
        },
        wildberries: {
          label: 'Wildberries',
          actions: [
            {
              id: 'wb-stocks',
              name: 'Остатки WB',
              description: 'Получить остатки на складах WB.',
              method: 'GET',
              path: '/api/v1/supplier/stocks'
            }
          ]
        }
      }}
    />
  );
}
