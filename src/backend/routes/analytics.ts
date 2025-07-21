import expressAnalytics from 'express';
const routerAnalytics = expressAnalytics.Router()

console.log('📦 Загружен роут analytics')

routerAnalytics.get('/dashboard', (req: any, res: any) => {
  res.json({ 
    message: 'Analytics dashboard route working',
    revenue: 0,
    ordersCount: 0,
    avgOrder: 0,
    conversionRate: 0
  })
})

routerAnalytics.get('/charts', (req: any, res: any) => {
  res.json({ 
    message: 'Analytics charts route working',
    data: []
  })
})

export default routerAnalytics