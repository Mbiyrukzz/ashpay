const { v4: uuidv4 } = require('uuid')
const Employee = require('../models/Employee')
const { calculateKraDeductions } = require('../controllers/kraDeductions')

const validatePhone = (phone) => /^(\+?\d{10,15})$/.test(phone)

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
        id = uuidv4(),
      } = req.body

      if (!name?.trim() || !email?.trim() || !salary) {
        return res
          .status(400)
          .json({ error: 'Name, email, and salary are required.' })
      }

      if (phone && !validatePhone(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format.' })
      }

      const existing = await Employee.findOne({
        $or: [{ email: email.trim() }, { employeeId }],
      })

      if (existing) {
        return res.status(409).json({ error: 'Employee already exists.' })
      }

      // Combine user-provided and KRA deductions
      const kraDeductions = calculateKraDeductions(salary)
      const allDeductions = [...deductions, ...kraDeductions]

      const newEmployee = new Employee({
        id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone,
        department,
        position,
        salary,
        deductions: allDeductions,
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
