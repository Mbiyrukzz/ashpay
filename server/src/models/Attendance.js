const mongoose = require('mongoose')

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Leave', 'Half-Day'],
      required: true,
    },
    clockIn: Date,
    clockOut: Date,
    notes: String,
  },
  { timestamps: true }
)

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('Attendance', attendanceSchema)
