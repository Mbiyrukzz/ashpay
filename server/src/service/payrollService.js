const { v4: uuidv4 } = require('uuid')
const Employee = require('../models/Employee')
const Payroll = require('../models/Payroll')
const { calculateStatutoryDeductions } = require('../controllers/kraDeductions')

class PayrollService {
  /**
   * Calculate payroll for a single employee
   */
  static async calculateEmployeePayroll(employee, month, year, options = {}) {
    try {
      const {
        workingDays = 22,
        daysWorked = 22,
        overtimeHours = 0,
        overtimeRate = 1.5,
        customAdvances = 0,
        customLoans = 0,
      } = options

      const basicSalary = employee.salary
      let grossSalary = basicSalary

      // Calculate overtime pay
      const dailyRate = basicSalary / workingDays
      const hourlyRate = dailyRate / 8 // Assuming 8-hour workday
      const overtimePay = overtimeHours * hourlyRate * overtimeRate

      // Adjust gross salary for days worked
      if (daysWorked !== workingDays) {
        grossSalary = (basicSalary / workingDays) * daysWorked
      }

      // Add overtime to gross salary
      grossSalary += overtimePay

      // Calculate benefits
      const totalBenefits = employee.benefits.reduce((sum, benefit) => {
        return sum + (benefit.amount || 0)
      }, 0)

      // Calculate taxable income (gross + benefits for tax purposes)
      const taxableIncome = grossSalary + totalBenefits

      // Calculate KRA statutory deductions based on taxable income
      const kraDeductions = calculateStatutoryDeductions(taxableIncome)

      // Process custom deductions (excluding statutory ones)
      const customDeductions = employee.deductions
        .filter(
          (ded) => !['SHIF', 'NSSF', 'Housing Levy', 'PAYE'].includes(ded.type)
        )
        .map((ded) => ({
          ...ded,
          amount: ded.amount || 0,
        }))

      // Add runtime advances and loans if provided
      if (customAdvances > 0) {
        customDeductions.push({
          type: 'Advance Payment',
          amount: customAdvances,
          description: `Advance payment for ${this.getMonthName(
            month
          )} ${year}`,
          recurring: false,
        })
      }

      if (customLoans > 0) {
        customDeductions.push({
          type: 'Loan Repayment',
          amount: customLoans,
          description: `Loan repayment for ${this.getMonthName(month)} ${year}`,
          recurring: true,
        })
      }

      const allDeductions = [...kraDeductions, ...customDeductions]

      // Calculate totals
      const totalDeductions = allDeductions.reduce(
        (sum, ded) => sum + (ded.amount || 0),
        0
      )
      const netSalary = grossSalary + totalBenefits - totalDeductions

      // Extract specific deduction amounts for reporting
      const payeAmount =
        kraDeductions.find((d) => d.type === 'PAYE')?.amount || 0
      const nssfAmount =
        kraDeductions.find((d) => d.type === 'NSSF')?.amount || 0
      const shifAmount =
        kraDeductions.find((d) => d.type === 'SHIF')?.amount || 0
      const housingLevyAmount =
        kraDeductions.find((d) => d.type === 'Housing Levy')?.amount || 0

      return {
        employeeId: employee._id,
        employeeName: employee.name,
        employeeNumber: employee.employeeId,
        basicSalary,
        grossSalary: Math.round(grossSalary),
        deductions: allDeductions,
        benefits: employee.benefits,
        totalDeductions: Math.round(totalDeductions),
        totalBenefits: Math.round(totalBenefits),
        netSalary: Math.round(netSalary),
        taxableIncome: Math.round(taxableIncome),
        payeAmount: Math.round(payeAmount),
        nssfAmount: Math.round(nssfAmount),
        shifAmount: Math.round(shifAmount),
        housingLevyAmount: Math.round(housingLevyAmount),
        workingDays,
        daysWorked,
        overtime: Math.round(overtimePay),
        overtimeHours,
        advances: customAdvances,
        loans: customLoans,
        allowances: totalBenefits,
        status: 'generated',
      }
    } catch (error) {
      console.error(
        `Error calculating payroll for employee ${employee.name}:`,
        error
      )
      throw new Error(
        `Failed to calculate payroll for ${employee.name}: ${error.message}`
      )
    }
  }

  /**
   * Generate monthly payroll for all employees
   */
  static async generateMonthlyPayroll(month, year, options = {}) {
    const startTime = Date.now()
    const errors = []
    const warnings = []

    try {
      console.log(
        `Starting payroll generation for ${this.getMonthName(month)} ${year}`
      )

      const {
        payDate,
        cutoffDate,
        workingDays = 22,
        generatedBy = 'system',
        notes = '',
      } = options

      // Validation
      if (month < 1 || month > 12) {
        throw new Error('Month must be between 1 and 12')
      }

      if (year < 2020 || year > 2030) {
        throw new Error('Year must be between 2020 and 2030')
      }

      // Check if payroll already exists for this month/year
      const existingPayroll = await Payroll.findByPeriod(month, year)
      if (existingPayroll) {
        return {
          success: false,
          message: `Payroll for ${this.getMonthName(
            month
          )} ${year} already exists`,
          payrollId: existingPayroll.payrollId,
          existingPayroll: {
            status: existingPayroll.status,
            generationDate: existingPayroll.generationDate,
            totalEmployees: existingPayroll.totalEmployees,
          },
        }
      }

      // Get all active employees
      const employees = await Employee.find({
        $or: [{ isActive: { $ne: false } }, { isActive: { $exists: false } }],
        salary: { $gt: 0 },
      }).lean()

      if (employees.length === 0) {
        throw new Error('No active employees found with valid salaries')
      }

      console.log(`Found ${employees.length} active employees`)

      // Calculate payroll for each employee
      const payrollItems = []
      let totalGrossPay = 0
      let totalDeductions = 0
      let totalBenefits = 0
      let totalNetPay = 0
      let totalPaye = 0
      let totalNssf = 0
      let totalShif = 0
      let totalHousingLevy = 0
      let totalOvertime = 0
      let totalAdvances = 0
      let totalLoans = 0

      for (const employee of employees) {
        try {
          const payrollItem = await this.calculateEmployeePayroll(
            employee,
            month,
            year,
            { workingDays, ...options.employeeOptions?.[employee._id] }
          )

          payrollItems.push(payrollItem)

          // Add to totals
          totalGrossPay += payrollItem.grossSalary
          totalDeductions += payrollItem.totalDeductions
          totalBenefits += payrollItem.totalBenefits
          totalNetPay += payrollItem.netSalary
          totalPaye += payrollItem.payeAmount
          totalNssf += payrollItem.nssfAmount
          totalShif += payrollItem.shifAmount
          totalHousingLevy += payrollItem.housingLevyAmount
          totalOvertime += payrollItem.overtime
          totalAdvances += payrollItem.advances
          totalLoans += payrollItem.loans
        } catch (error) {
          const errorMessage = `Failed to calculate payroll for ${employee.name}: ${error.message}`
          console.error(errorMessage)
          errors.push(errorMessage)

          // Continue with other employees
          warnings.push(`Skipped ${employee.name} due to calculation error`)
        }
      }

      if (payrollItems.length === 0) {
        throw new Error(
          'No valid payroll items generated. Check employee data and try again.'
        )
      }

      // Generate payroll ID
      const payrollId = `PAYROLL-${year}-${month
        .toString()
        .padStart(2, '0')}-${Date.now()}`

      // Set default dates
      const defaultPayDate = payDate || new Date(year, month, 1) // 1st of next month
      const defaultCutoffDate = cutoffDate || new Date(year, month - 1, 0) // Last day of current month

      // Create payroll record
      const payroll = new Payroll({
        payrollId,
        month,
        year,
        payPeriod: `${this.getMonthName(month)} ${year}`,
        payDate: defaultPayDate,
        cutoffDate: defaultCutoffDate,
        totalEmployees: payrollItems.length,
        totalGrossPay: Math.round(totalGrossPay),
        totalDeductions: Math.round(totalDeductions),
        totalBenefits: Math.round(totalBenefits),
        totalNetPay: Math.round(totalNetPay),
        totalPaye: Math.round(totalPaye),
        totalNssf: Math.round(totalNssf),
        totalShif: Math.round(totalShif),
        totalHousingLevy: Math.round(totalHousingLevy),
        totalOvertime: Math.round(totalOvertime),
        totalAdvances: Math.round(totalAdvances),
        totalLoans: Math.round(totalLoans),
        payrollItems,
        generatedBy,
        notes,
        status: 'draft',
        metadata: {
          processingTime: Date.now() - startTime,
          errors,
          warnings,
        },
      })

      await payroll.save()

      const processingTime = Date.now() - startTime
      console.log(
        `Payroll generated successfully: ${payrollId} (${processingTime}ms)`
      )

      return {
        success: true,
        message: `Payroll for ${this.getMonthName(
          month
        )} ${year} generated successfully`,
        payrollId: payroll.payrollId,
        summary: {
          totalEmployees: payroll.totalEmployees,
          totalGrossPay: payroll.totalGrossPay,
          totalNetPay: payroll.totalNetPay,
          totalDeductions: payroll.totalDeductions,
          processingTime,
          errorsCount: errors.length,
          warningsCount: warnings.length,
        },
        metadata: {
          errors,
          warnings,
        },
      }
    } catch (error) {
      console.error('Error generating payroll:', error)
      throw new Error(`Payroll generation failed: ${error.message}`)
    }
  }

  /**
   * Update payroll status
   */
  static async updatePayrollStatus(payrollId, status, options = {}) {
    try {
      const { approvedBy, notes } = options

      const validStatuses = [
        'draft',
        'finalized',
        'approved',
        'paid',
        'cancelled',
      ]
      if (!validStatuses.includes(status)) {
        throw new Error(
          `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        )
      }

      const payroll = await Payroll.findOne({ payrollId })
      if (!payroll) {
        throw new Error('Payroll not found')
      }

      // Status transition validation
      const currentStatus = payroll.status
      const validTransitions = {
        draft: ['finalized', 'cancelled'],
        finalized: ['approved', 'draft', 'cancelled'],
        approved: ['paid', 'finalized', 'cancelled'],
        paid: [], // Cannot change from paid
        cancelled: ['draft'], // Can only go back to draft
      }

      if (!validTransitions[currentStatus].includes(status)) {
        throw new Error(
          `Cannot change status from ${currentStatus} to ${status}`
        )
      }

      const updateData = { status }

      // Set appropriate timestamp and user fields
      switch (status) {
        case 'finalized':
          updateData.finalizedBy = approvedBy
          updateData.finalizedAt = new Date()
          break
        case 'approved':
          updateData.approvedBy = approvedBy
          updateData.approvedAt = new Date()
          break
        case 'paid':
          updateData.paidBy = approvedBy
          updateData.paidAt = new Date()
          break
      }

      if (notes) updateData.notes = notes

      const updatedPayroll = await Payroll.findOneAndUpdate(
        { payrollId },
        updateData,
        {
          new: true,
          select:
            'payrollId status approvedBy approvedAt finalizedBy finalizedAt paidBy paidAt notes',
        }
      )

      return {
        success: true,
        message: `Payroll status updated to ${status}`,
        payroll: updatedPayroll,
      }
    } catch (error) {
      console.error('Error updating payroll status:', error)
      throw error
    }
  }

  /**
   * Get payroll statistics
   */
  static async getPayrollStatistics(year) {
    try {
      const stats = await Payroll.getStatistics(year)
      return (
        stats[0] || {
          totalPayrolls: 0,
          totalGrossPay: 0,
          totalNetPay: 0,
          totalDeductions: 0,
          averageEmployees: 0,
        }
      )
    } catch (error) {
      console.error('Error getting payroll statistics:', error)
      throw error
    }
  }

  /**
   * Helper method to get month name
   */
  static getMonthName(month) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    return months[month - 1] || 'Unknown'
  }

  /**
   * Validate payroll data
   */
  static validatePayrollData(month, year, options = {}) {
    const errors = []

    if (!month || month < 1 || month > 12) {
      errors.push('Month must be between 1 and 12')
    }

    if (!year || year < 2020 || year > 2030) {
      errors.push('Year must be between 2020 and 2030')
    }

    if (options.payDate && new Date(options.payDate) < new Date()) {
      errors.push('Pay date cannot be in the past')
    }

    if (
      options.workingDays &&
      (options.workingDays < 1 || options.workingDays > 31)
    ) {
      errors.push('Working days must be between 1 and 31')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

module.exports = PayrollService
