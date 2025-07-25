const defaultBenefits = [
  'Medical Insurance',
  'Transport Allowance',
  'Housing Allowance',
  'Meal Allowance',
  'Phone Allowance',
  'Overtime',
  'Commission',
]

const benefitCalculators = {
  'Medical Insurance': (gross) => gross * 0.02, // 2%
  'Transport Allowance': () => 3000,
  'Housing Allowance': (gross) => gross * 0.15, // 15%
  'Meal Allowance': () => 2000,
  'Phone Allowance': () => 1000,
  Overtime: () => 0,
  Commission: () => 0,
}

const getEmployeeBenefitsForEmployee = (employee) => {
  const { gross, benefitOverrides = {}, excludedBenefits = [] } = employee

  return defaultBenefits
    .filter((type) => !excludedBenefits.includes(type))
    .map((type) => {
      const amount =
        typeof benefitOverrides[type] === 'number'
          ? benefitOverrides[type]
          : benefitCalculators[type]?.(gross) || 0

      return {
        type,
        amount: Math.round(amount),
        recurring: !['Overtime', 'Commission'].includes(type),
      }
    })
}

module.exports = { getEmployeeBenefitsForEmployee }
