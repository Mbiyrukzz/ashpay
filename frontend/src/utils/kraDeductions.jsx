// src/utils/kraDeductions.js
export const calculateKraDeductions = (salary) => {
  if (!salary || isNaN(salary)) {
    return []
  }

  const deductions = []
  const salaryNum = parseFloat(salary)

  // NHIF
  let nhif = 0
  if (salaryNum <= 5999) nhif = 150
  else if (salaryNum <= 7999) nhif = 300
  else if (salaryNum <= 11999) nhif = 400
  else if (salaryNum <= 14999) nhif = 500
  else if (salaryNum <= 19999) nhif = 600
  else if (salaryNum <= 24999) nhif = 750
  else if (salaryNum <= 29999) nhif = 850
  else if (salaryNum <= 34999) nhif = 900
  else if (salaryNum <= 39999) nhif = 950
  else if (salaryNum <= 44999) nhif = 1000
  else if (salaryNum <= 49999) nhif = 1100
  else if (salaryNum <= 59999) nhif = 1200
  else if (salaryNum <= 69999) nhif = 1300
  else if (salaryNum <= 79999) nhif = 1400
  else if (salaryNum <= 89999) nhif = 1500
  else if (salaryNum <= 99999) nhif = 1600
  else nhif = 1700

  deductions.push({ type: 'NHIF', amount: nhif, recurring: true })

  // NSSF
  const nssf = Math.min(salaryNum * 0.06, 1080)
  deductions.push({ type: 'NSSF', amount: Math.round(nssf), recurring: true })

  // Housing Levy
  const housingLevy = salaryNum * 0.015
  deductions.push({
    type: 'Housing Levy',
    amount: Math.round(housingLevy),
    recurring: true,
  })

  // PAYE
  let paye = 0
  if (salaryNum <= 24000) {
    paye = 0
  } else if (salaryNum <= 32333) {
    paye = (salaryNum - 24000) * 0.25
  } else if (salaryNum <= 500000) {
    paye = (32333 - 24000) * 0.25 + (salaryNum - 32333) * 0.3
  } else if (salaryNum <= 800000) {
    paye =
      (32333 - 24000) * 0.25 +
      (500000 - 32333) * 0.3 +
      (salaryNum - 500000) * 0.325
  } else {
    paye =
      (32333 - 24000) * 0.25 +
      (500000 - 32333) * 0.3 +
      (800000 - 500000) * 0.325 +
      (salaryNum - 800000) * 0.35
  }

  const personalRelief = 2400
  paye = Math.max(paye - personalRelief, 0)

  deductions.push({ type: 'PAYE', amount: Math.round(paye), recurring: true })

  return deductions
}

export const benefitCalculators = {
  'Medical Insurance': (gross) => gross * 0.02,
  'Transport Allowance': () => 3000,
  'Housing Allowance': (gross) => gross * 0.15,
  'Meal Allowance': () => 2000,
  'Phone Allowance': () => 1000,
  Overtime: () => 0,
  Commission: () => 0,
}

export const calculateBenefits = (salary, benefitConfig) => {
  if (!salary || isNaN(salary)) {
    return []
  }

  const salaryNum = parseFloat(salary)
  const benefits = []

  Object.entries(benefitConfig).forEach(([type, config]) => {
    if (config.enabled) {
      const defaultAmount = benefitCalculators[type]
        ? benefitCalculators[type](salaryNum)
        : 0
      const amount =
        config.customAmount !== '' && !isNaN(config.customAmount)
          ? parseFloat(config.customAmount)
          : defaultAmount

      benefits.push({
        type,
        amount: Math.round(amount),
        recurring: !['Overtime', 'Commission'].includes(type),
      })
    }
  })

  return benefits
}

export const calculateSalaryBreakdown = (
  grossSalary,
  deductions = [],
  benefits = []
) => {
  const gross = parseFloat(grossSalary) || 0

  const totalDeductions = deductions.reduce(
    (sum, ded) => sum + (ded.amount || 0),
    0
  )
  const totalBenefits = benefits.reduce(
    (sum, ben) => sum + (ben.amount || 0),
    0
  )
  const netSalary = gross - totalDeductions + totalBenefits

  return {
    grossSalary: gross,
    totalDeductions,
    totalBenefits,
    netSalary,
    deductions,
    benefits,
  }
}

export const validatePayeCalculation = (salary, payeAmount) => {
  const salaryNum = parseFloat(salary) || 0

  if (salaryNum < 24000 && payeAmount > 0) {
    return {
      isValid: false,
      warning: `PAYE should be 0 for salaries below KES 24,000. Current PAYE: KES ${payeAmount.toLocaleString()}`,
    }
  }

  if (salaryNum >= 50000 && salaryNum <= 100000) {
    const expectedRange = { min: 2000, max: 15000 }
    if (payeAmount < expectedRange.min || payeAmount > expectedRange.max) {
      return {
        isValid: false,
        warning: `PAYE (KES ${payeAmount.toLocaleString()}) seems unusual for this salary range. Expected: KES ${expectedRange.min.toLocaleString()} - KES ${expectedRange.max.toLocaleString()}`,
      }
    }
  }

  return { isValid: true, warning: null }
}

export const DEFAULT_BENEFITS = [
  'Medical Insurance',
  'Transport Allowance',
  'Housing Allowance',
  'Meal Allowance',
  'Phone Allowance',
  'Overtime',
  'Commission',
]

export const DEFAULT_DEDUCTIONS = [
  'Loan Repayment',
  'Advance Salary',
  'Disciplinary Fine',
  'Union Dues',
]
