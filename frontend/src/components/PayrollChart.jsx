import React from 'react'
import styled from 'styled-components'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const ChartContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 400px;
`

const ChartTitle = styled.h3`
  font-size: 1.2rem;
  color: #1f2937;
  margin-bottom: 1.25rem;
  font-weight: 600;
`

const data = [
  { month: 'Jan', expenses: 800 },
  { month: 'Feb', expenses: 900 },
  { month: 'Mar', expenses: 1100 },
  { month: 'Apr', expenses: 1500 },
  { month: 'May', expenses: 1800 },
  { month: 'Jun', expenses: 1400 },
  { month: 'Jul', expenses: 1700 },
  { month: 'Aug', expenses: 1600 },
  { month: 'Sep', expenses: 1200 },
  { month: 'Oct', expenses: 1300 },
  { month: 'Nov', expenses: 1100 },
  { month: 'Dec', expenses: 900 },
]

// Custom tooltip styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'white',
          padding: '0.75rem 1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        }}
      >
        <strong>{label}</strong>
        <div style={{ marginTop: '0.25rem', color: '#10b981' }}>
          ${payload[0].value.toLocaleString()}
        </div>
      </div>
    )
  }
  return null
}

const PayrollChart = () => {
  return (
    <ChartContainer>
      <ChartTitle>Monthly Payroll Expenses</ChartTitle>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="expenses" fill="#10b981" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default PayrollChart
