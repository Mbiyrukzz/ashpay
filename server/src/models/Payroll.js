const mongoose = require('mongoose')

const PayrollItemSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    employeeName: { type: String, required: true },
    employeeNumber: { type: String, required: true },
    basicSalary: { type: Number, required: true },
    grossSalary: { type: Number, required: true },
    deductions: [
      {
        type: { type: String, required: true },
        amount: { type: Number, required: true },
        description: String,
        recurring: { type: Boolean, default: true },
      },
    ],
    benefits: [
      {
        type: { type: String, required: true },
        amount: { type: Number, required: true },
        description: String,
        recurring: { type: Boolean, default: true },
      },
    ],
    totalDeductions: { type: Number, required: true },
    totalBenefits: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    taxableIncome: { type: Number, required: true },
    payeAmount: { type: Number, required: true, default: 0 },
    nssfAmount: { type: Number, required: true, default: 0 },
    shifAmount: { type: Number, required: true, default: 0 },
    housingLevyAmount: { type: Number, required: true, default: 0 },
    workingDays: { type: Number, default: 22 },
    daysWorked: { type: Number, default: 22 },
    overtime: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    advances: { type: Number, default: 0 },
    loans: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    commissions: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['generated', 'reviewed', 'approved', 'paid', 'hold'],
      default: 'generated',
    },
    notes: String,
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'cash', 'cheque', 'mobile_money'],
      default: 'bank_transfer',
    },
  },
  {
    timestamps: true,
  }
)

const PayrollSchema = new mongoose.Schema(
  {
    payrollId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
      max: 2050,
    },
    payPeriod: {
      type: String,
      required: true,
    }, // e.g., "January 2025"
    generationDate: {
      type: Date,
      default: Date.now,
    },
    payDate: {
      type: Date,
      required: true,
    },
    cutoffDate: {
      type: Date,
    }, // Last day of work period
    status: {
      type: String,
      enum: ['draft', 'finalized', 'approved', 'paid', 'cancelled'],
      default: 'draft',
      index: true,
    },
    totalEmployees: {
      type: Number,
      required: true,
      min: 0,
    },
    totalGrossPay: {
      type: Number,
      required: true,
      min: 0,
    },
    totalDeductions: {
      type: Number,
      required: true,
      min: 0,
    },
    totalBenefits: {
      type: Number,
      required: true,
      min: 0,
    },
    totalNetPay: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPaye: {
      type: Number,
      required: true,
      min: 0,
    },
    totalNssf: {
      type: Number,
      required: true,
      min: 0,
    },
    totalShif: {
      type: Number,
      required: true,
      min: 0,
    },
    totalHousingLevy: {
      type: Number,
      required: true,
      min: 0,
    },
    totalOvertime: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAdvances: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalLoans: {
      type: Number,
      default: 0,
      min: 0,
    },
    payrollItems: [PayrollItemSchema],
    generatedBy: {
      type: String,
      default: 'system',
    },
    approvedBy: String,
    approvedAt: Date,
    finalizedBy: String,
    finalizedAt: Date,
    paidBy: String,
    paidAt: Date,
    notes: String,
    metadata: {
      processingTime: Number, // milliseconds
      errors: [String],
      warnings: [String],
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
PayrollSchema.index({ year: -1, month: -1 })
PayrollSchema.index({ status: 1, generationDate: -1 })
PayrollSchema.index({ payDate: 1 })

// Virtual for formatted pay period
PayrollSchema.virtual('formattedPayPeriod').get(function () {
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
  return `${months[this.month - 1]} ${this.year}`
})

// Method to calculate summary statistics
PayrollSchema.methods.calculateSummary = function () {
  return {
    totalEmployees: this.payrollItems.length,
    averageGrossPay:
      this.totalEmployees > 0 ? this.totalGrossPay / this.totalEmployees : 0,
    averageNetPay:
      this.totalEmployees > 0 ? this.totalNetPay / this.totalEmployees : 0,
    deductionRate:
      this.totalGrossPay > 0
        ? (this.totalDeductions / this.totalGrossPay) * 100
        : 0,
    netPayRate:
      this.totalGrossPay > 0
        ? (this.totalNetPay / this.totalGrossPay) * 100
        : 0,
  }
}

// Static method to find payroll by period
PayrollSchema.statics.findByPeriod = function (month, year) {
  return this.findOne({ month, year })
}

// Static method to get payroll statistics
PayrollSchema.statics.getStatistics = async function (year) {
  return this.aggregate([
    { $match: { year: year, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        totalPayrolls: { $sum: 1 },
        totalGrossPay: { $sum: '$totalGrossPay' },
        totalNetPay: { $sum: '$totalNetPay' },
        totalDeductions: { $sum: '$totalDeductions' },
        averageEmployees: { $avg: '$totalEmployees' },
      },
    },
  ])
}

module.exports = mongoose.model('Payroll', PayrollSchema)
