const { createEmployeeRoute } = require('./createEmployeeRoute')
const { createUserRoute } = require('./createUserRoute')
const { deleteEmployeeRoute } = require('./deleteEmployeeRoute')
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
]
module.exports = { routes }
