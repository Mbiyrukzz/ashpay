const { createEmployeeRoute } = require('./createEmployeeRoute')
const { deleteEmployeeRoute } = require('./deleteEmployeeRoute')
const { listEmployeesRoute } = require('./listEmployeeRoute')
const { updateEmployeeRoute } = require('./updateEmployeeRoute')

const routes = [
  createEmployeeRoute,
  listEmployeesRoute,
  updateEmployeeRoute,
  deleteEmployeeRoute,
]
module.exports = { routes }
