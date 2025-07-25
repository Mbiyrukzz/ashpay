// models/Employee.js
const { v4: uuidv4 } = require('uuid')
const mongoose = require('mongoose')

// Deduction sub-schema
const deductionSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  recurring: { type: Boolean, default: true },
})

// Benefit sub-schema
const benefitSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  recurring: { type: Boolean, default: true },
})

// Employee schema
const employeeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: uuidv4,
    },
    name: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, unique: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    position: { type: String, trim: true },
    department: { type: String, trim: true },
    salary: { type: Number, required: true, min: 0 },
    deductions: { type: [deductionSchema], default: [] },
    benefits: { type: [benefitSchema], default: [] }, // Updated to use benefitSchema
    netPay: { type: Number, default: 0 },
    bankDetails: {
      bankName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      branch: { type: String, trim: true },
    },
    hireDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Auto-calculate netPay before saving
employeeSchema.pre('save', function (next) {
  const totalDeductions = this.deductions.reduce((sum, d) => sum + d.amount, 0)
  const totalBenefits = this.benefits.reduce((sum, b) => sum + b.amount, 0)
  this.netPay = this.salary - totalDeductions + totalBenefits
  next()
})

module.exports = mongoose.model('Employee', employeeSchema)
