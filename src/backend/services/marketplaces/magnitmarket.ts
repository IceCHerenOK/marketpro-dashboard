import axios, { AxiosInstance } from 'axios'

export class MagnitmarketAPI {
  private api: AxiosInstance
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.api = axios.create({
      baseURL: 'https://api.magnitmarket.ru',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
  }

  async testConnection(): Promise<any> {
    try {
      const response = await this.api.get('/api/v1/seller/info')
      return { success: true, data: response.data }
    } catch (error) {
      throw new Error(`Ошибка подключения к Магнитмаркет: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить список товаров
  async getProducts(limit: number = 100, offset: number = 0): Promise<any> {
    try {
      const response = await this.api.get('/api/v1/products', {
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
      const params: any = { date_from: dateFrom }
      if (dateTo) params.date_to = dateTo
      
      const response = await this.api.get('/api/v1/orders', { params })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения заказов: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить остатки товаров
  async getStocks(): Promise<any> {
    try {
      const response = await this.api.get('/api/v1/stocks')
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения остатков: ${error.response?.data?.message || error.message}`)
    }
  }

  // Обновить цены товаров
  async updatePrices(products: Array<{ id: string, price: number }>): Promise<any> {
    try {
      const response = await this.api.post('/api/v1/prices', {
        products
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка обновления цен: ${error.response?.data?.message || error.message}`)
    }
  }

  // Обновить остатки товаров
  async updateStocks(stocks: Array<{ product_id: string, quantity: number }>): Promise<any> {
    try {
      const response = await this.api.post('/api/v1/stocks', {
        stocks
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка обновления остатков: ${error.response?.data?.message || error.message}`)
    }
  }
}