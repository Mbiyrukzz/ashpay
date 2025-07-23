import React from 'react'
import EmployeeContext from '../contexts/EmployeeContext'

const EmployeeProvider = ({ children }) => {
  return <EmployeeContext.Provider>{children}</EmployeeContext.Provider>
}

export default EmployeeProvider
