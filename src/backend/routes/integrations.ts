import express from 'express';
import authenticateToken from '../middleware/auth';
import { requestMarketplace } from '../services/marketplaceClient';

const integrationsRouter = express.Router();

const sanitizePath = (path: string) => {
  if (!path.startsWith('/')) {
    return `/${path}`;
  }
  return path;
};

integrationsRouter.post('/:marketplace/request', authenticateToken, async (req: any, res) => {
  try {
    const { marketplace } = req.params;
    const { method, path, data, params, headers } = req.body || {};
    const normalizedPath = sanitizePath(path || '');

    if (!['ozon', 'wildberries'].includes(marketplace)) {
      return res.status(400).json({ error: 'Unsupported marketplace' });
    }

    if (!method || !normalizedPath || normalizedPath === '/') {
      return res.status(400).json({ error: 'Method and path are required' });
    }

    const response = await requestMarketplace(req.user.id, marketplace, {
      method,
      url: normalizedPath,
      data,
      params,
      headers
    });

    res.json({
      status: response.status,
      data: response.data
    });
  } catch (error: any) {
    const status = error?.response?.status || 500;
    res.status(status).json({
      error: 'Marketplace request failed',
      details: error?.response?.data || error.message
    });
  }
});

export default integrationsRouter;
