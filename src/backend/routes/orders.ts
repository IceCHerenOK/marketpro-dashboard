import expressOrders from 'express';
const ordersRouter = expressOrders.Router()

console.log('📦 Загружен роут orders')

ordersRouter.get('/', (req: any, res: any) => {
  res.json({ message: 'Orders route working', orders: [] })
})

export default ordersRouter