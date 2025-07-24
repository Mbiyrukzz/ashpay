import React, { useState, useEffect, useCallback } from 'react'
import EmployeeContext from '../contexts/EmployeeContext'
import useAuthedRequest from '../hooks/useAuthedRequest'
import useUser from '../hooks/useUser'

const EmployeeProvider = ({ children }) => {
  const { user } = useUser()
  const { isReady, get, post, put, del } = useAuthedRequest()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEmployees = useCallback(async () => {
    if (!isReady) return
    setLoading(true)
    try {
      const res = await get('/employees')
      setEmployees(res.employees || [])
    } catch (error) {
      console.error('❌ Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }, [get, isReady])

  const createEmployee = async (employeeData) => {
    try {
      const newEmployee = await post('/employees', employeeData)
      setEmployees((prev) => [...prev, newEmployee])
    } catch (err) {
      console.error('❌ Error creating employee:', err)
    }
  }

  const updateEmployee = async (id, updatedData) => {
    try {
      const updated = await put(`/employees/${id}`, updatedData)
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? updated : emp))
      )
    } catch (err) {
      console.error('❌ Error updating employee:', err)
    }
  }

  const deleteEmployee = async (id) => {
    try {
      await del(`/employees/${id}`)
      setEmployees((prev) => prev.filter((emp) => emp._id !== id))
    } catch (err) {
      console.error('❌ Error deleting employee:', err)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const value = {
    employees,
    loading,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  }

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  )
}

export default EmployeeProvider
