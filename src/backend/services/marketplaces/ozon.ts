import axios, { AxiosInstance } from 'axios'

export class OzonAPI {
  private api: AxiosInstance
  private clientId: string
  private apiKey: string

  constructor(clientId: string, apiKey: string) {
    this.clientId = clientId
    this.apiKey = apiKey
    this.api = axios.create({
      baseURL: 'https://api-seller.ozon.ru',
      headers: {
        'Client-Id': clientId,
        'Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    })
  }

  async testConnection(): Promise<any> {
    try {
      const response = await this.api.post('/v1/report/info')
      return { success: true, data: response.data }
    } catch (error) {
      throw new Error(`Ошибка подключения к OZON: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить список товаров
  async getProducts(limit: number = 100, lastId?: string): Promise<any> {
    try {
      const body: any = { limit }
      if (lastId) body.last_id = lastId
      
      const response = await this.api.post('/v2/product/list', body)
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения товаров: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить информацию о товаре
  async getProductInfo(productId: number): Promise<any> {
    try {
      const response = await this.api.post('/v2/product/info', {
        product_id: productId
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения информации о товаре: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить заказы
  async getOrders(dateFrom: string, dateTo: string, status?: string): Promise<any> {
    try {
      const body: any = {
        dir: 'ASC',
        filter: {
          since: dateFrom,
          to: dateTo
        },
        limit: 1000,
        offset: 0
      }
      
      if (status) body.filter.status = status
      
      const response = await this.api.post('/v3/posting/fbs/list', body)
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения заказов: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить остатки товаров
  async getStocks(): Promise<any> {
    try {
      const response = await this.api.post('/v3/product/info/stocks', {
        limit: 1000,
        offset: 0
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения остатков: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить финансовые отчеты
  async getFinanceReports(dateFrom: string, dateTo: string): Promise<any> {
    try {
      const response = await this.api.post('/v3/finance/realization', {
        date: {
          from: dateFrom,
          to: dateTo
        }
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения финансовых отчетов: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить аналитику
  async getAnalytics(dateFrom: string, dateTo: string, metrics: string[]): Promise<any> {
    try {
      const response = await this.api.post('/v1/analytics/data', {
        date_from: dateFrom,
        date_to: dateTo,
        metrics,
        dimension: ['sku'],
        filters: [],
        sort: []
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения аналитики: ${error.response?.data?.message || error.message}`)
    }
  }

  // Обновить цены товаров
  async updatePrices(prices: Array<{ product_id: number, price: string }>): Promise<any> {
    try {
      const response = await this.api.post('/v1/product/import/prices', {
        prices
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка обновления цен: ${error.response?.data?.message || error.message}`)
    }
  }

  // Обновить остатки товаров
  async updateStocks(stocks: Array<{ product_id: number, stock: number }>): Promise<any> {
    try {
      const response = await this.api.post('/v1/product/import/stocks', {
        stocks
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка обновления остатков: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить рекламные кампании
  async getAdvertisingCampaigns(): Promise<any> {
    try {
      const response = await this.api.get('/v1/supplier/performance')
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения рекламных кампаний: ${error.response?.data?.message || error.message}`)
    }
  }

  // Создать товар
  async createProduct(productData: any): Promise<any> {
    try {
      const response = await this.api.post('/v2/product/import', {
        items: [productData]
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка создания товара: ${error.response?.data?.message || error.message}`)
    }
  }
}