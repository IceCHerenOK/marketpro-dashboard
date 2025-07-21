import expressProducts from 'express';
const productsRouter = expressProducts.Router()

console.log('📦 Загружен роут products')

productsRouter.get('/', (req: any, res: any) => {
  res.json({ message: 'Products route working', products: [] })
})

export default productsRouter