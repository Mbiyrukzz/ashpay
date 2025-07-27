const { createEmployeeRoute } = require('./createEmployeeRoute')
const { createUserRoute } = require('./createUserRoute')
const { deleteEmployeeRoute } = require('./deleteEmployeeRoute')
const {
  generatePayrollRoute,
  previewPayrollRoute,
  getPayrollListRoute,
  updatePayrollStatusRoute,
  scheduleMonthlyPayroll,
  getPayrollDetailsRoute,
} = require('./generatePayrollRoute')
const { getUserProfileRoute } = require('./getUserProfileRoutes')
const { listEmployeesRoute } = require('./listEmployeeRoute')
const { updateEmployeeRoute } = require('./updateEmployeeRoute')

const routes = [
  createUserRoute,
  getUserProfileRoute,

  createEmployeeRoute,
  listEmployeesRoute,
  updateEmployeeRoute,
  deleteEmployeeRoute,

  generatePayrollRoute,
  previewPayrollRoute,
  getPayrollListRoute,
  getPayrollDetailsRoute,
  updatePayrollStatusRoute,
]
module.exports = { routes }
