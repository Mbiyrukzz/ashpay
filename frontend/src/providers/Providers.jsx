import EmployeeProvider from './EmployeeProvider'
import PayrollOptionsProvider from './PayrollOptionsProvider'

const Providers = ({ children }) => {
  return (
    <EmployeeProvider>
      <PayrollOptionsProvider>{children}</PayrollOptionsProvider>
    </EmployeeProvider>
  )
}

export default Providers
