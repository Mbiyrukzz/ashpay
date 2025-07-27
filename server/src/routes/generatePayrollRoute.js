const cron = require('node-cron')
const PayrollService = require('../service/payrollService')
const Employee = require('../models/Employee')
const Payroll = require('../models/Payroll') // Ensure Payroll model is imported

// Manual payroll generation route
const generatePayrollRoute = {
  method: 'post',
  path: '/payroll/generate',
  middleware: [],
  handler: async (req, res) => {
    try {
      const {
        month,
        year,
        workingDays = 22,
        payDate,
        cutoffDate,
        generatedBy = 'manual',
        notes = '',
        employeeOptions = {},
      } = req.body

      const validation = PayrollService.validatePayrollData(month, year, {
        payDate,
        workingDays,
      })

      if (!validation.isValid) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.errors,
        })
      }

      const result = await PayrollService.generateMonthlyPayroll(month, year, {
        payDate: payDate ? new Date(payDate) : null,
        cutoffDate: cutoffDate ? new Date(cutoffDate) : null,
        workingDays,
        generatedBy,
        notes,
        employeeOptions,
      })

      if (!result.success) {
        return res.status(409).json({
          error: result.message,
          existingPayroll: result.existingPayroll,
        })
      }

      res.status(201).json({
        message: result.message,
        payrollId: result.payrollId,
        summary: result.summary,
        metadata: result.metadata,
      })
    } catch (error) {
      console.error('Error generating payroll:', error)
      res.status(500).json({
        error: 'Failed to generate payroll',
        details:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      })
    }
  },
}

// Payroll details route
const getPayrollDetailsRoute = {
  method: 'get',
  path: '/payroll/:payrollId',
  middleware: [],
  handler: async (req, res) => {
    try {
      const { payrollId } = req.params
      const payroll = await Payroll.findById(payrollId).lean()

      if (!payroll) {
        return res.status(404).json({
          error: 'Payroll not found',
        })
      }

      res.json({
        payroll,
      })
    } catch (error) {
      console.error('Error fetching payroll details:', error)
      res.status(500).json({
        error: 'Failed to fetch payroll details',
        details:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      })
    }
  },
}

// Auto-generate payroll on 28th of each month
const scheduleMonthlyPayroll = () => {
  cron.schedule(
    '0 9 28 * *',
    async () => {
      try {
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        console.log(
          `Starting automatic payroll generation for ${PayrollService.getMonthName(
            month
          )} ${year}`
        )

        const employeeCount = await Employee.countDocuments({
          $or: [{ isActive: { $ne: false } }, { isActive: { $exists: false } }],
          salary: { $gt: 0 },
        })

        if (employeeCount === 0) {
          console.log('No active employees found. Skipping payroll generation.')
          return
        }

        const result = await PayrollService.generateMonthlyPayroll(
          month,
          year,
          {
            workingDays: 22,
            generatedBy: 'auto-scheduler',
            notes: `Automatically generated on ${now.toISOString()}`,
          }
        )

        if (result.success) {
          console.log(`✅ Payroll generated successfully: ${result.payrollId}`)
          console.log(
            `📊 Summary: ${
              result.summary.totalEmployees
            } employees, Total: KES ${result.summary.totalNetPay.toLocaleString()}`
          )
        } else {
          console.log(`⚠️ Payroll generation skipped: ${result.message}`)
        }
      } catch (error) {
        console.error('❌ Error in automatic payroll generation:', error)
      }
    },
    {
      scheduled: true,
      timezone: 'Africa/Nairobi',
    }
  )

  console.log(
    '📅 Monthly payroll scheduler initialized - will run on 28th of each month at 9:00 AM'
  )
}

// Get payroll list
const getPayrollListRoute = {
  method: 'get',
  path: '/payroll',
  middleware: [],
  handler: async (req, res) => {
    try {
      const { page = 1, limit = 10, status, year, month } = req.query

      const filter = {}
      if (status) filter.status = status
      if (year) filter.year = parseInt(year)
      if (month) filter.month = parseInt(month)

      const skip = (parseInt(page) - 1) * parseInt(limit)

      const [payrolls, total] = await Promise.all([
        Payroll.find(filter)
          .sort({ year: -1, month: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .select('-payrollItems'),
        Payroll.countDocuments(filter),
      ])

      res.json({
        payrolls,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      })
    } catch (error) {
      console.error('Error fetching payroll list:', error)
      res.status(500).json({
        error: 'Failed to fetch payroll list',
        details:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      })
    }
  },
}

// Update payroll status
const updatePayrollStatusRoute = {
  method: 'put',
  path: '/payroll/:payrollId/status',
  middleware: [],
  handler: async (req, res) => {
    try {
      const { payrollId } = req.params
      const { status, notes, approvedBy = 'system' } = req.body

      const result = await PayrollService.updatePayrollStatus(
        payrollId,
        status,
        {
          approvedBy,
          notes,
        }
      )

      res.json(result)
    } catch (error) {
      console.error('Error updating payroll status:', error)
      res.status(500).json({
        error: error.message || 'Failed to update payroll status',
      })
    }
  },
}

// Preview payroll route
const previewPayrollRoute = {
  method: 'post',
  path: '/payroll/preview',
  middleware: [],
  handler: async (req, res) => {
    try {
      const { month, year, workingDays = 22, employeeOptions = {} } = req.body

      const validation = PayrollService.validatePayrollData(month, year, {
        workingDays,
      })
      if (!validation.isValid) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validation.errors,
        })
      }

      const employees = await Employee.find({
        $or: [{ isActive: { $ne: false } }, { isActive: { $exists: false } }],
        salary: { $gt: 0 },
      }).lean()

      if (employees.length === 0) {
        return res.status(404).json({
          error: 'No active employees found with valid salaries',
        })
      }

      const previewItems = []
      let totalGrossPay = 0
      let totalNetPay = 0
      let totalDeductions = 0

      for (const employee of employees) {
        try {
          const payrollItem = await PayrollService.calculateEmployeePayroll(
            employee,
            month,
            year,
            { workingDays, ...employeeOptions[employee._id] }
          )

          previewItems.push(payrollItem)
          totalGrossPay += payrollItem.grossSalary
          totalNetPay += payrollItem.netSalary
          totalDeductions += payrollItem.totalDeductions
        } catch (error) {
          console.error(
            `Error calculating preview for ${employee.name}:`,
            error
          )
        }
      }

      res.json({
        message: 'Payroll preview generated',
        period: `${PayrollService.getMonthName(month)} ${year}`,
        summary: {
          totalEmployees: previewItems.length,
          totalGrossPay: Math.round(totalGrossPay),
          totalNetPay: Math.round(totalNetPay),
          totalDeductions: Math.round(totalDeductions),
        },
        previewItems: previewItems.slice(0, 10),
        hasMore: previewItems.length > 10,
      })
    } catch (error) {
      console.error('Error generating payroll preview:', error)
      res.status(500).json({
        error: 'Failed to generate preview',
        details:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      })
    }
  },
}

module.exports = {
  generatePayrollRoute,
  previewPayrollRoute,
  getPayrollListRoute,
  updatePayrollStatusRoute,
  getPayrollDetailsRoute,
  scheduleMonthlyPayroll,
}
