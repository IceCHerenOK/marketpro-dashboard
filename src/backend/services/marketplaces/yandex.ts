import axios, { AxiosInstance } from 'axios'

export class YandexMarketAPI {
  private api: AxiosInstance
  private apiKey: string
  private clientId: string

  constructor(apiKey: string, clientId: string) {
    this.apiKey = apiKey
    this.clientId = clientId
    this.api = axios.create({
      baseURL: 'https://api.partner.market.yandex.ru',
      headers: {
        'Authorization': `OAuth oauth_token="${apiKey}", oauth_client_id="${clientId}"`,
        'Content-Type': 'application/json'
      }
    })
  }

  async testConnection(): Promise<any> {
    try {
      const response = await this.api.get('/v2/campaigns')
      return { success: true, data: response.data }
    } catch (error) {
      throw new Error(`Ошибка подключения к Яндекс Маркет: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить список товаров
  async getProducts(campaignId: string, limit: number = 200): Promise<any> {
    try {
      const response = await this.api.get(`/v2/campaigns/${campaignId}/offer-mapping-entries`, {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения товаров: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить заказы
  async getOrders(campaignId: string, dateFrom: string, dateTo?: string): Promise<any> {
    try {
      const params: any = { fromDate: dateFrom }
      if (dateTo) params.toDate = dateTo
      
      const response = await this.api.get(`/v2/campaigns/${campaignId}/orders`, { params })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения заказов: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить остатки товаров
  async getStocks(campaignId: string): Promise<any> {
    try {
      const response = await this.api.get(`/v2/campaigns/${campaignId}/offers/stocks`)
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения остатков: ${error.response?.data?.message || error.message}`)
    }
  }

  // Получить статистику
  async getStats(campaignId: string, dateFrom: string, dateTo: string): Promise<any> {
    try {
      const response = await this.api.post(`/v2/campaigns/${campaignId}/stats/orders`, {
        dateFrom,
        dateTo
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка получения статистики: ${error.response?.data?.message || error.message}`)
    }
  }

  // Обновить цены товаров
  async updatePrices(campaignId: string, offers: Array<{ id: string, price: { value: number, currencyId: string } }>): Promise<any> {
    try {
      const response = await this.api.post(`/v2/campaigns/${campaignId}/offer-prices/updates`, {
        offers
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка обновления цен: ${error.response?.data?.message || error.message}`)
    }
  }

  // Обновить остатки товаров
  async updateStocks(campaignId: string, skus: Array<{ sku: string, warehouseId: number, items: Array<{ count: number, type: string, updatedAt: string }> }>): Promise<any> {
    try {
      const response = await this.api.put(`/v2/campaigns/${campaignId}/offers/stocks`, {
        skus
      })
      return response.data
    } catch (error) {
      throw new Error(`Ошибка обновления остатков: ${error.response?.data?.message || error.message}`)
    }
  }
}