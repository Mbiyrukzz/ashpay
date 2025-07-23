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
      } = req.body

      // Basic validation
      if (!name?.trim() || !email?.trim() || !salary) {
        return res.status(400).json({
          error: 'Name, email, and salary are required.',
        })
      }

      // Check duplicate email or employeeId
      const existing = await Employee.findOne({
        $or: [{ email: email.trim() }, { employeeId }],
      })
      if (existing) {
        return res.status(409).json({
          error: 'An employee with this email or ID already exists.',
        })
      }

      // Create and save employee
      const newEmployee = new Employee({
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
      res.status(500).json({
        error: 'Failed to create employee',
        details: error.message,
      })
    }
  },
}

module.exports = { createEmployeeRoute }
