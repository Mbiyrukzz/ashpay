const Payroll = require('../models/Payroll')
const Attendance = require('../models/Attendance')
const Employee = require('../models/Employee')
const moment = require('moment')

exports.generatePayrollForMonth = async (req, res) => {
  try {
    const { month } = req.body // Expecting format '2025-07'
    const start = moment(month).startOf('month').toDate()
    const end = moment(month).endOf('month').toDate()

    const employees = await Employee.find({ isActive: true })

    const payrolls = await Promise.all(
      employees.map(async (emp) => {
        const attendanceRecords = await Attendance.find({
          employeeId: emp._id,
          date: { $gte: start, $lte: end },
          status: 'Present',
        })

        const daysPresent = attendanceRecords.length
        const totalDeductions = emp.deductions.reduce(
          (sum, d) => sum + d.amount,
          0
        )
        const totalBenefits =
          (emp.benefits || []).reduce?.((sum, b) => sum + (b.amount || 0), 0) ||
          0
        const netPay = emp.salary + totalBenefits - totalDeductions

        return {
          employeeId: emp._id,
          name: emp.name,
          employeeIdCode: emp.employeeId,
          month,
          baseSalary: emp.salary,
          totalDeductions,
          totalBenefits,
          daysPresent,
          netPay,
          generatedAt: new Date(),
        }
      })
    )

    await Payroll.insertMany(payrolls)
    res.status(201).json({ message: 'Payroll generated', payrolls })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate payroll' })
  }
}
