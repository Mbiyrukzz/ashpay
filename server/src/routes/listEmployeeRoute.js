const Employee = require('../models/Employee')

const listEmployeesRoute = {
  method: 'get',
  path: '/employees',
  middleware: [],
  handler: async (req, res) => {
    try {
      const {
        department,
        isActive,
        sortBy = 'createdAt',
        order = 'desc',
        limit = 20,
        offset = 0,
      } = req.query

      const query = {}

      if (department) query.department = department
      if (isActive !== undefined) query.isActive = isActive === 'true'

      const sortOptions = {}
      sortOptions[sortBy] = order === 'asc' ? 1 : -1

      const [employees, total] = await Promise.all([
        Employee.find(query)
          .sort(sortOptions)
          .skip(parseInt(offset))
          .limit(parseInt(limit)),
        Employee.countDocuments(query),
      ])

      res.json({
        employees,
        total,
        offset: parseInt(offset),
        limit: parseInt(limit),
      })
    } catch (error) {
      console.error('❌ Error fetching employees:', error.message)
      res.status(500).json({ error: 'Failed to list employees' })
    }
  },
}

module.exports = { listEmployeesRoute }
