import axios, { AxiosRequestConfig } from 'axios';
import { db } from '../database/init';
import { decryptSecret } from '../utils/crypto';

type MarketplaceKey = 'ozon' | 'wildberries';

const baseUrls: Record<MarketplaceKey, string> = {
  ozon: 'https://api-seller.ozon.ru',
  wildberries: 'https://suppliers-api.wildberries.ru'
};

const getCredentials = async (userId: number, marketplace: MarketplaceKey) =>
  new Promise<{
    apiKey?: string | null;
    clientId?: string | null;
    secretKey?: string | null;
    sellerId?: string | null;
  }>((resolve, reject) => {
    db.get(
      `SELECT api_key, client_id, secret_key, seller_id FROM marketplace_settings WHERE user_id = ? AND marketplace = ?`,
      [userId, marketplace],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          resolve({});
          return;
        }
        resolve({
          apiKey: decryptSecret(row.api_key),
          clientId: decryptSecret(row.client_id),
          secretKey: decryptSecret(row.secret_key),
          sellerId: decryptSecret(row.seller_id)
        });
      }
    );
  });

export const requestMarketplace = async (
  userId: number,
  marketplace: MarketplaceKey,
  config: AxiosRequestConfig
) => {
  const creds = await getCredentials(userId, marketplace);
  if (marketplace === 'ozon') {
    if (!creds.apiKey || !creds.clientId) {
      throw new Error('Ozon credentials are missing');
    }
    config.headers = {
      ...(config.headers || {}),
      'Api-Key': creds.apiKey,
      'Client-Id': creds.clientId,
      'Content-Type': 'application/json'
    };
  }
  if (marketplace === 'wildberries') {
    if (!creds.apiKey) {
      throw new Error('Wildberries API key is missing');
    }
    config.headers = {
      ...(config.headers || {}),
      Authorization: creds.apiKey,
      'Content-Type': 'application/json'
    };
  }

  return axios({
    baseURL: baseUrls[marketplace],
    timeout: 30000,
    ...config
  });
};
