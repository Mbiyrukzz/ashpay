const Employee = require('../models/Employee')

const deleteEmployeeRoute = {
  method: 'delete',
  path: '/employees/:id',
  middleware: [],
  handler: async (req, res) => {
    try {
      const { id } = req.params
      const deleted = await Employee.findByIdAndDelete(id)

      if (!deleted) {
        return res.status(404).json({ error: 'Employee not found' })
      }

      res.status(200).json({ message: 'Employee deleted successfully' })
    } catch (err) {
      console.error('❌ Failed to delete employee:', err)
      res.status(500).json({ error: 'Failed to delete employee' })
    }
  },
}

module.exports = { deleteEmployeeRoute }
