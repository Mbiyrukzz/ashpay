import PayrollOptionsContext from '../contexts/PayrollOptionsContext'

const defaultDeductions = ['PAYE', 'NHIF', 'NSSF', 'Housing Levy', 'HELB']

const defaultBenefits = [
  'Medical Cover',
  'Transport Allowance',
  'Housing Allowance',
  'Meal Allowance',
]

const PayrollOptionsProvider = ({ children }) => {
  return (
    <PayrollOptionsContext.Provider
      value={{
        deductions: defaultDeductions,
        benefits: defaultBenefits,
      }}
    >
      {children}
    </PayrollOptionsContext.Provider>
  )
}

export default PayrollOptionsProvider
