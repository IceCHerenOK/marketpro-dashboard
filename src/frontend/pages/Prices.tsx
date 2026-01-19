import React from 'react';
import MarketplaceActionPanel from '../components/MarketplaceActionPanel';

export default function Prices() {
  return (
    <MarketplaceActionPanel
      title="Цены"
      description="Управление ценами и скидками для Ozon и WB."
      marketplaces={{
        ozon: {
          label: 'Ozon',
          actions: [
            {
              id: 'ozon-import-prices',
              name: 'Импорт цен',
              description: 'Обновление цен по SKU.',
              method: 'POST',
              path: '/v1/product/import/prices',
              defaultBody: {
                prices: [
                  {
                    offer_id: '',
                    price: '0',
                    old_price: '0',
                    premium_price: '0'
                  }
                ]
              }
            },
            {
              id: 'ozon-info-prices',
              name: 'Информация по ценам',
              description: 'Получение текущих цен по товарам.',
              method: 'POST',
              path: '/v5/product/info/prices',
              defaultBody: {
                filter: { offer_id: [], product_id: [], visibility: 'ALL' },
                limit: 50,
                last_id: ''
              }
            }
          ]
        },
        wildberries: {
          label: 'Wildberries',
          actions: [
            {
              id: 'wb-update-prices',
              name: 'Обновить цены',
              description: 'Обновить цены по номенклатурам WB.',
              method: 'POST',
              path: '/public/api/v1/prices',
              defaultBody: [
                {
                  nmId: 0,
                  price: 0
                }
              ]
            }
          ]
        }
      }}
    />
  );
}
