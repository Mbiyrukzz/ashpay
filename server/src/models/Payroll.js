const mongoose = require('mongoose')

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  name: String,
  employeeIdCode: String,
  month: String, // '2025-07'
  baseSalary: Number,
  totalDeductions: Number,
  totalBenefits: Number,
  daysPresent: Number,
  netPay: Number,
  generatedAt: Date,
})

module.exports = mongoose.model('Payroll', payrollSchema)
