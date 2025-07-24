import { createContext } from 'react'

const PayrollOptionsContext = createContext({
  deductions: [],
  benefits: [],
})

export default PayrollOptionsContext
