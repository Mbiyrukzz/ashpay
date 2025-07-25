const Employee = require('../models/Employee')
const { calculateStatutoryDeductions } = require('../controllers/kraDeductions')
const {
  getEmployeeBenefitsForEmployee,
} = require('../controllers/employeeBenefits')

const validatePhone = (phone) => /^(\+?\d{10,15})$/.test(phone)

const updateEmployeeRoute = {
  method: 'put',
  path: '/employees/:id',
  middleware: [],
  handler: async (req, res) => {
    try {
      const { id } = req.params
      const {
        name,
        email,
        phone,
        department,
        position,
        salary,
        deductions = [],
        benefits = {},
        employeeId,
      } = req.body

      // Validate updates
      if (!name?.trim() || !email?.trim() || !salary) {
        return res
          .status(400)
          .json({ error: 'Name, email, and salary are required' })
      }
      if (isNaN(salary) || parseFloat(salary) <= 0) {
        return res
          .status(400)
          .json({ error: 'Salary must be a valid positive number' })
      }
      if (phone && !validatePhone(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' })
      }

      const existing = await Employee.findOne({
        $and: [
          { _id: { $ne: id } },
          {
            $or: [
              { email: email.trim().toLowerCase() },
              ...(employeeId ? [{ employeeId: employeeId.trim() }] : []),
            ],
          },
        ],
      })
      if (existing) {
        const field =
          existing.email === email.trim().toLowerCase()
            ? 'email'
            : 'employee ID'
        return res
          .status(409)
          .json({ error: `Employee with this ${field} already exists` })
      }

      const employee = await Employee.findById(id)
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' })
      }

      // Calculate statutory deductions
      const kraDeductions = calculateStatutoryDeductions(parseFloat(salary))
      console.log('Statutory Deductions:', kraDeductions)

      // Filter user deductions
      const userDeductions = deductions.filter(
        (d) => !['NHIF', 'NSSF', 'Housing Levy', 'PAYE'].includes(d.type)
      )
      const allDeductions = [...kraDeductions, ...userDeductions]
      console.log('All Deductions:', allDeductions)

      // Process benefits
      const { benefitOverrides = {}, excludedBenefits = [] } = benefits
      const processedBenefits = getEmployeeBenefitsForEmployee({
        gross: parseFloat(salary),
        benefitOverrides,
        excludedBenefits,
      })
      console.log('Processed Benefits:', processedBenefits)

      // Update employee
      employee.name = name.trim()
      employee.email = email.trim().toLowerCase()
      employee.phone = phone?.trim() || null
      employee.department = department?.trim() || null
      employee.position = position?.trim()
      employee.salary = parseFloat(salary)
      employee.deductions = allDeductions
      employee.benefits = processedBenefits
      if (employeeId) employee.employeeId = employeeId.trim()

      // Save to trigger pre('save') hook
      await employee.save()
      console.log('Saved Employee:', {
        salary: employee.salary,
        deductions: employee.deductions,
        benefits: employee.benefits,
        netPay: employee.netPay,
      })

      // Calculate totals for response
      const totalDeductions = employee.deductions.reduce(
        (sum, d) => sum + d.amount,
        0
      )
      const totalBenefits = employee.benefits.reduce(
        (sum, b) => sum + b.amount,
        0
      )
      const netSalary = employee.salary - totalDeductions + totalBenefits

      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        employee: {
          ...employee.toObject(),
          totalDeductions,
          totalBenefits,
          netSalary,
        },
      })
    } catch (error) {
      console.error('Error updating employee:', error)
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message)
        return res
          .status(400)
          .json({ error: 'Validation failed', details: errors })
      }
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0]
        return res
          .status(409)
          .json({ error: `Employee with this ${field} already exists` })
      }
      res.status(500).json({
        error: 'Failed to update employee',
        details:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      })
    }
  },
}

module.exports = { updateEmployeeRoute }
