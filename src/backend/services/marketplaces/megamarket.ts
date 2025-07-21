import axios, { AxiosInstance } from 'axios'

export class MegamarketAPI {
  private api: AxiosInstance
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.api = axios.create({
      baseURL: 'https://api.megamarket.tech',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
  }

  async testConnection(): Promise<any> {
    try {
      const response = await this.api.get('/api/market/v1/partnerInfo')
      return { success: true, data: response.data }
    } catch (error) {
      throw new Error(`Ошибка подключения к Мегамаркет: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить список товаров
  async getProducts(limit: number = 100, offset: number = 0): Promise<any> {
    try {
      const response = await this.api.get('/api/market/v1/offerService/manualPrice/list', {
        params: { limit, offset }
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения товаров: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить заказы
  async getOrders(dateFrom: string, dateTo?: string): Promise<any> {
    try {
      const params: any = { dateFrom }
      if (dateTo) params.dateTo = dateTo
      
      const response = await this.api.get('/api/market/v1/orderService/order/search', { params })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения заказов: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить остатки товаров
  async getStocks(): Promise<any> {
    try {
      const response = await this.api.get('/api/market/v1/offerService/stock/list')
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения остатков: ${error.response?.data?.message || error.message}`)
    }
  }

  // Обновить цены товаров
  async updatePrices(offers: Array<{ offerId: string, price: number }>): Promise<any> {
    try {
      const response = await this.api.post('/api/market/v1/offerService/manualPrice', {
        offers
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка обновления цен: ${error.response?.data?.message || error.message}`)
    }
  }

  // Обновить остатки товаров
  async updateStocks(stocks: Array<{ offerId: string, quantity: number }>): Promise<any> {
    try {
      const response = await this.api.post('/api/market/v1/offerService/stock', {
        stocks
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка обновления остатков: ${error.response?.data?.message || error.message}`)
    }
  }
}