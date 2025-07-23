const Employee = require('../models/Employee')

const updateEmployeeRoute = {
  method: 'put',
  path: '/employees/:id',
  middleware: [],
  handler: async (req, res) => {
    try {
      const { id } = req.params
      const updateData = req.body

      // Optional: recalculate netPay if salary/deductions changed
      if (updateData.salary || updateData.deductions) {
        const salary = updateData.salary ?? 0
        const deductions = updateData.deductions ?? []
        const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0)
        updateData.netPay = salary - totalDeductions
      }

      const updated = await Employee.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })

      if (!updated) {
        return res.status(404).json({ error: 'Employee not found' })
      }

      res.status(200).json(updated)
    } catch (err) {
      console.error('❌ Failed to update employee:', err)
      res.status(500).json({ error: 'Failed to update employee' })
    }
  },
}

module.exports = { updateEmployeeRoute }
