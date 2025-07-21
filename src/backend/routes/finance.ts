import expressFinance from 'express';
const routerFinance = expressFinance.Router()

console.log('📦 Загружен роут finance')

routerFinance.get('/transactions', (req: any, res: any) => {
  res.json({ 
    message: 'Finance transactions route working',
    transactions: [],
    total: 0
  })
})

routerFinance.get('/summary', (req: any, res: any) => {
  res.json({ 
    message: 'Finance summary route working',
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0
  })
})

export default routerFinance