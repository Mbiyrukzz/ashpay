const { v4: uuidv4 } = require('uuid')
const Employee = require('../models/Employee')

const createEmployeeRoute = {
  method: 'post',
  path: '/employees',
  middleware: [],
  handler: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        department,
        position,
        salary,
        deductions = [],
        benefits = [],
        bankDetails = {},
        employeeId,
        id = uuidv4(), // default or from client
      } = req.body

      if (!name?.trim() || !email?.trim() || !salary) {
        return res
          .status(400)
          .json({ error: 'Name, email, and salary are required.' })
      }

      const existing = await Employee.findOne({
        $or: [{ email: email.trim() }, { employeeId }],
      })
      if (existing) {
        return res.status(409).json({ error: 'Employee already exists.' })
      }

      const newEmployee = new Employee({
        id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone,
        department,
        position,
        salary,
        deductions,
        benefits,
        bankDetails,
        employeeId,
      })

      await newEmployee.save()

      res.status(201).json({
        message: 'Employee created successfully',
        employee: newEmployee,
      })
    } catch (error) {
      console.error('Error creating employee:', error)
      res
        .status(500)
        .json({ error: 'Failed to create employee', details: error.message })
    }
  },
}

module.exports = { createEmployeeRoute }
