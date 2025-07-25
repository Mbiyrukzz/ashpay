const { v4: uuidv4 } = require('uuid')
const Employee = require('../models/Employee')
const { calculateStatutoryDeductions } = require('../controllers/kraDeductions')

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
        benefits = [], // Changed: now expects an array from frontend
        bankDetails = {},
        employeeId,
        id = uuidv4(),
        photo,
      } = req.body

      // Validation
      if (!name?.trim() || !email?.trim() || !salary) {
        return res
          .status(400)
          .json({ error: 'Name, email, and salary are required.' })
      }

      if (isNaN(salary) || parseFloat(salary) <= 0) {
        return res
          .status(400)
          .json({ error: 'Salary must be a valid positive number.' })
      }

      if (phone && !validatePhone(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format.' })
      }

      // Check for existing employee
      const existing = await Employee.findOne({
        $or: [
          { email: email.trim().toLowerCase() },
          ...(employeeId ? [{ employeeId }] : []),
        ],
      })

      if (existing) {
        const field =
          existing.email === email.trim().toLowerCase()
            ? 'email'
            : 'employee ID'
        return res.status(409).json({
          error: `Employee with this ${field} already exists.`,
        })
      }

      // Calculate KRA deductions
      const kraDeductions = calculateStatutoryDeductions(parseFloat(salary))

      // Handle additional deductions from frontend
      const userDeductions = deductions
        .filter(
          (ded) => !['NHIF', 'NSSF', 'Housing Levy', 'PAYE'].includes(ded.type)
        )
        .map((ded) => {
          if (typeof ded === 'string') {
            return { type: ded, amount: 0 }
          }
          return ded
        })

      const allDeductions = [...kraDeductions, ...userDeductions]

      // Process benefits - use the array directly from frontend
      // Only include benefits that were actually selected (enabled) in frontend
      const processedBenefits = benefits.filter(
        (benefit) => benefit.amount > 0 || benefit.enabled !== false
      )

      // Generate employee ID if not provided
      const generatedEmployeeId = employeeId || `EMP-${Date.now()}`

      const newEmployee = new Employee({
        id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        department: department?.trim() || null,
        position: position?.trim() || null,
        salary: parseFloat(salary),
        deductions: allDeductions,
        benefits: processedBenefits, // Use filtered benefits
        bankDetails,
        employeeId: generatedEmployeeId,
        photo: photo || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await newEmployee.save()

      // Calculate totals for response
      const totalDeductions = allDeductions.reduce(
        (sum, ded) => sum + (ded.amount || 0),
        0
      )
      const totalBenefits = processedBenefits.reduce(
        (sum, ben) => sum + (ben.amount || 0),
        0
      )
      const netSalary = parseFloat(salary) - totalDeductions + totalBenefits

      res.status(201).json({
        message: 'Employee created successfully',
        employee: {
          ...newEmployee.toObject(),
          totalDeductions,
          totalBenefits,
          netSalary,
        },
      })
    } catch (error) {
      console.error('Error creating employee:', error)

      // Handle MongoDB validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message)
        return res.status(400).json({
          error: 'Validation failed',
          details: errors,
        })
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]
        return res.status(409).json({
          error: `Employee with this ${field} already exists.`,
        })
      }

      res.status(500).json({
        error: 'Failed to create employee',
        details:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      })
    }
  },
}

module.exports = { createEmployeeRoute }
