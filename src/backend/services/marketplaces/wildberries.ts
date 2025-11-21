import axios, { AxiosInstance } from 'axios'

export class WildberriesAPI {
  private api: AxiosInstance
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.api = axios.create({
      baseURL: 'https://suppliers-api.wildberries.ru',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    })
  }

  async testConnection(): Promise<any> {
    try {
      const response = await this.api.get('/api/v3/warehouses')
      return { success: true, data: response.data }
    } catch (error: any) {
      throw new Error(`Ошибка подключения к Wildberries: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить список товаров
  async getProducts(limit: number = 100): Promise<any> {
    try {
      const response = await this.api.post('/content/v1/cards/cursor/list', {
        sort: { cursor: { limit } },
        query: {},
        filter: {
          withPhoto: -1
        }
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Ошибка получения товаров: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить заказы
  async getOrders(dateFrom: string, dateTo?: string): Promise<any> {
    try {
      const response = await this.api.post('/api/v3/orders', {
        dateFrom,
        dateTo,
        flag: 0
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Ошибка получения заказов: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить продажи
  async getSales(dateFrom: string, dateTo?: string): Promise<any> {
    try {
      const response = await this.api.post('/api/v3/sales', {
        dateFrom,
        dateTo,
        flag: 0
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Ошибка получения продаж: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить остатки товаров
  async getStocks(warehouseId: number, skus?: string[]): Promise<any> {
    try {
      const payload: any = { warehouseId }
      if (skus?.length) {
        payload.skus = skus
      }

      const response = await this.api.post('/api/v3/stocks', payload)
      return response.data
    } catch (error: any) {
      throw new Error(`Ошибка получения остатков: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить финансовые отчеты
  async getFinanceReports(dateFrom: string, dateTo: string): Promise<any> {
    try {
      const response = await this.api.post('/api/v5/supplier/reportDetailByPeriod', {
        dateFrom,
        dateTo
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Ошибка получения финансовых отчетов: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить статистику рекламы
  async getAdvertisingStats(campaigns: string[]): Promise<any> {
    try {
      const response = await this.api.post('/adv/v2/fullstats', { campaigns })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения статистики рекламы: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить список рекламных кампаний
  async getAdvertisingCampaigns(limit: number = 100, offset: number = 0): Promise<any> {
    try {
      const response = await this.api.post('/adv/v1/promotion/list', {
        limit,
        offset
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Ошибка получения рекламных кампаний: ${error.response?.data?.message || error.message}`)
    }
  }

  // Обновить цены товаров
  async updatePrices(prices: Array<{ nmId: number, price: number }>): Promise<any> {
    try {
      const response = await this.api.post('/public/api/v1/prices', {
        prices
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Ошибка обновления цен: ${error.response?.data?.message || error.message}`)
    }
  }

  // Обновить остатки товаров
  async updateStocks(warehouseId: number, stocks: Array<{ sku: string, amount: number }>): Promise<any> {
    try {
      const response = await this.api.post(`/api/v3/stocks/${warehouseId}`, { stocks })
      return response.data
    } catch (error: any) {
      throw new Error(`Ошибка обновления остатков: ${error.response?.data?.message || error.message}`)
    }
  }
}