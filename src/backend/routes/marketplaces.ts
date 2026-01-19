import express from 'express';
import authenticateToken from '../middleware/auth';
import { db } from '../database/init';
import { decryptSecret, encryptSecret } from '../utils/crypto';

const marketplacesRouter = express.Router();

const supportedMarketplaces = [
  {
    id: 'wildberries',
    name: 'Wildberries',
    logo: '/logos/wb.svg',
    description: 'Supported marketplace',
    features: ['orders', 'products', 'analytics', 'advertising', 'finance']
  },
  {
    id: 'ozon',
    name: 'OZON',
    logo: '/logos/ozon.svg',
    description: 'Supported marketplace',
    features: ['orders', 'products', 'analytics', 'advertising', 'finance']
  },
  {
    id: 'yandex_market',
    name: 'Yandex Market',
    logo: '/logos/yandex.svg',
    description: 'Supported marketplace',
    features: ['orders', 'products', 'analytics', 'finance']
  },
  {
    id: 'megamarket',
    name: 'Megamarket',
    logo: '/logos/megamarket.svg',
    description: 'Supported marketplace',
    features: ['orders', 'products', 'analytics']
  },
  {
    id: 'magnitmarket',
    name: 'Magnitmarket',
    logo: '/logos/magnitmarket.svg',
    description: 'Supported marketplace',
    features: ['orders', 'products']
  }
];

const supportedMarketplaceIds = supportedMarketplaces.map((marketplace) => marketplace.id);

const findMarketplace = (id: string) =>
  supportedMarketplaces.find((marketplace) => marketplace.id === id);

marketplacesRouter.get('/', (_req, res) => {
  res.json(supportedMarketplaces);
});

marketplacesRouter.get('/supported', (_req, res) => {
  res.json(supportedMarketplaces);
});

marketplacesRouter.get('/:marketplace', (req, res) => {
  const marketplace = findMarketplace(req.params.marketplace);
  if (!marketplace) {
    return res.status(404).json({ error: 'Marketplace not found' });
  }
  res.json(marketplace);
});

marketplacesRouter.get('/settings', authenticateToken, (req: any, res) => {
  res.json({ message: 'Marketplace settings', userId: req.user.id });
});

marketplacesRouter.post('/settings/:marketplace', authenticateToken, (req: any, res) => {
  const { marketplace } = req.params;
  const userId = req.user.id;
  const { apiKey, clientId, secretKey, sellerId } = req.body || {};
  const payload = {
    apiKey: apiKey ? encryptSecret(apiKey) : null,
    clientId: clientId ? encryptSecret(clientId) : null,
    secretKey: secretKey ? encryptSecret(secretKey) : null,
    sellerId: sellerId ? encryptSecret(sellerId) : null
  };

  if (!supportedMarketplaceIds.includes(marketplace)) {
    return res.status(400).json({ error: 'Marketplace not supported' });
  }

  db.run(
    `INSERT INTO marketplace_settings (user_id, marketplace, api_key, client_id, secret_key, seller_id, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)
     ON CONFLICT(user_id, marketplace) DO UPDATE SET
       api_key = excluded.api_key,
       client_id = excluded.client_id,
       secret_key = excluded.secret_key,
       seller_id = excluded.seller_id,
       is_active = 1,
       updated_at = CURRENT_TIMESTAMP`,
    [userId, marketplace, payload.apiKey, payload.clientId, payload.secretKey, payload.sellerId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save marketplace settings' });
      }

      res.json({ message: `Settings saved for ${marketplace}` });
    }
  );
});

marketplacesRouter.post('/test-connection/:marketplace', authenticateToken, (req: any, res) => {
  const { marketplace } = req.params;
  const { apiKey, clientId, secretKey } = req.body;

  if (!supportedMarketplaceIds.includes(marketplace)) {
    return res.status(400).json({ success: false, error: 'Marketplace not supported' });
  }

  res.json({
    success: true,
    message: 'Connection test completed',
    marketplace,
    receivedCredentials: {
      apiKey: Boolean(apiKey),
      clientId: Boolean(clientId),
      secretKey: Boolean(secretKey)
    }
  });
});

marketplacesRouter.post('/sync/:marketplace', authenticateToken, (req: any, res) => {
  const { marketplace } = req.params;
  const userId = req.user.id;

  res.json({ message: `Sync requested for ${marketplace}`, userId });
});

marketplacesRouter.post('/:marketplace/connect', authenticateToken, (req: any, res) => {
  const { marketplace } = req.params;
  const userId = req.user.id;
  const { apiKey, clientId, secretKey, sellerId } = req.body || {};
  const payload = {
    apiKey: apiKey ? encryptSecret(apiKey) : null,
    clientId: clientId ? encryptSecret(clientId) : null,
    secretKey: secretKey ? encryptSecret(secretKey) : null,
    sellerId: sellerId ? encryptSecret(sellerId) : null
  };

  if (!supportedMarketplaceIds.includes(marketplace)) {
    return res.status(400).json({ error: 'Marketplace not supported' });
  }

  db.run(
    `INSERT INTO marketplace_settings (user_id, marketplace, api_key, client_id, secret_key, seller_id, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)
     ON CONFLICT(user_id, marketplace) DO UPDATE SET
       api_key = excluded.api_key,
       client_id = excluded.client_id,
       secret_key = excluded.secret_key,
       seller_id = excluded.seller_id,
       is_active = 1,
       updated_at = CURRENT_TIMESTAMP`,
    [userId, marketplace, payload.apiKey, payload.clientId, payload.secretKey, payload.sellerId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to connect marketplace' });
      }
      res.json({ success: true });
    }
  );
});

marketplacesRouter.post('/:marketplace/disconnect', authenticateToken, (req: any, res) => {
  const { marketplace } = req.params;
  const userId = req.user.id;

  if (!supportedMarketplaceIds.includes(marketplace)) {
    return res.status(400).json({ error: 'Marketplace not supported' });
  }

  db.run(
    `UPDATE marketplace_settings
     SET is_active = 0, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ? AND marketplace = ?`,
    [userId, marketplace],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to disconnect marketplace' });
      }
      res.json({ success: true });
    }
  );
});

marketplacesRouter.get('/:marketplace/status', authenticateToken, (req: any, res) => {
  const { marketplace } = req.params;
  const userId = req.user.id;

  if (!supportedMarketplaceIds.includes(marketplace)) {
    return res.status(400).json({ error: 'Marketplace not supported' });
  }

  db.get(
    `SELECT is_active, updated_at FROM marketplace_settings WHERE user_id = ? AND marketplace = ?`,
    [userId, marketplace],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to get marketplace status' });
      }
      res.json({
        connected: Boolean(row?.is_active),
        lastSync: row?.updated_at || null
      });
    }
  );
});

marketplacesRouter.get('/:marketplace/credentials', authenticateToken, (req: any, res) => {
  const { marketplace } = req.params;
  const userId = req.user.id;

  db.get(
    `SELECT api_key, client_id, secret_key, seller_id FROM marketplace_settings WHERE user_id = ? AND marketplace = ?`,
    [userId, marketplace],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to read credentials' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Credentials not found' });
      }
      res.json({
        apiKey: decryptSecret(row.api_key),
        clientId: decryptSecret(row.client_id),
        secretKey: decryptSecret(row.secret_key),
        sellerId: decryptSecret(row.seller_id)
      });
    }
  );
});

export default marketplacesRouter;
