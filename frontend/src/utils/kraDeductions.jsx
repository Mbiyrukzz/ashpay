// src/utils/kraDeductions.js
export const calculateKraDeductions = (salary) => {
  if (!salary || isNaN(salary)) {
    return []
  }

  const deductions = []
  const salaryNum = parseFloat(salary)

  // SHIF (Social Health Insurance Fund) - 2.75% of gross salary
  const shif = salaryNum * 0.0275
  deductions.push({
    type: 'SHIF',
    amount: Math.round(shif),
    recurring: true,
    description: 'Social Health Insurance Fund (2.75% of gross)',
  })

  // NSSF - Based on LEL and UEL structure with Tier 1 and Tier 2
  let nssfAmount = 0
  let tier1Amount = 0
  let tier2Amount = 0

  // Lower Earnings Limit (LEL): KES 8,000
  // Upper Earnings Limit (UEL): KES 72,000
  // Employee contributes 6% on pensionable earnings between LEL and UEL

  const lel = 8000 // Lower Earnings Limit
  const uel = 72000 // Upper Earnings Limit

  // Tier 1: Contribution on earnings up to LEL (KES 8,000)
  if (salaryNum > 0) {
    const tier1Base = Math.min(salaryNum, lel)
    tier1Amount = tier1Base * 0.06 // 6% on earnings up to LEL
  }

  // Tier 2: Contribution on earnings above LEL up to UEL
  if (salaryNum > lel) {
    const tier2Base = Math.min(salaryNum, uel) - lel
    tier2Amount = tier2Base * 0.06 // 6% on earnings between LEL and UEL
  }

  // Total NSSF = Tier 1 + Tier 2, capped at KES 4,320
  nssfAmount = Math.min(tier1Amount + tier2Amount, 4320)

  let nssfDescription = ''
  if (salaryNum <= 0) {
    nssfDescription = 'No NSSF contribution'
  } else if (salaryNum <= lel) {
    nssfDescription = `NSSF Tier 1: 6% on KES ${Math.min(
      salaryNum,
      lel
    ).toLocaleString()}`
  } else {
    const tier1Base = Math.min(salaryNum, lel)
    const tier2Base = Math.min(salaryNum, uel) - lel
    nssfDescription = `NSSF - Tier 1: 6% on KES ${tier1Base.toLocaleString()} + Tier 2: 6% on KES ${tier2Base.toLocaleString()}`
    if (tier1Amount + tier2Amount > 4320) {
      nssfDescription += ' (capped at KES 4,320)'
    }
  }

  deductions.push({
    type: 'NSSF',
    amount: Math.round(nssfAmount),
    recurring: true,
    description: nssfDescription,
    tier1: Math.round(tier1Amount),
    tier2: Math.round(tier2Amount),
  })

  // Housing Levy - 1.5% of gross salary
  const housingLevy = salaryNum * 0.015
  deductions.push({
    type: 'Housing Levy',
    amount: Math.round(housingLevy),
    recurring: true,
    description: 'Affordable Housing Levy (1.5% of gross)',
  })

  // PAYE - Updated to start from KES 27,000
  let paye = 0
  let payeDescription = ''

  if (salaryNum <= 24000) {
    paye = 0
    payeDescription = 'No PAYE tax (salary ≤ KES 27,000)'
  } else if (salaryNum <= 32333) {
    paye = (salaryNum - 24000) * 0.25
    payeDescription = '25% on amount above KES 27,000'
  } else if (salaryNum <= 500000) {
    paye = (32333 - 24000) * 0.25 + (salaryNum - 32333) * 0.3
    payeDescription = '25% (KES 27,001-32,333) + 30% (above KES 32,333)'
  } else if (salaryNum <= 800000) {
    paye =
      (32333 - 24000) * 0.25 +
      (500000 - 32333) * 0.3 +
      (salaryNum - 500000) * 0.325
    payeDescription = 'Progressive rates up to 32.5%'
  } else {
    paye =
      (32333 - 24000) * 0.25 +
      (500000 - 32333) * 0.3 +
      (800000 - 500000) * 0.325 +
      (salaryNum - 800000) * 0.35
    payeDescription = 'Progressive rates up to 35%'
  }

  const personalRelief = 2400
  const grossPaye = paye
  paye = Math.max(paye - personalRelief, 0)

  deductions.push({
    type: 'PAYE',
    amount: Math.round(paye),
    recurring: true,
    description:
      payeDescription +
      (grossPaye > 0 ? ' (less KES 2,400 personal relief)' : ''),
  })

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

  // Updated validation for new PAYE threshold
  if (salaryNum < 24000 && payeAmount > 0) {
    return {
      isValid: false,
      warning: `PAYE should be 0 for salaries below KES 27,000. Current PAYE: KES ${payeAmount.toLocaleString()}`,
    }
  }

  if (salaryNum >= 50000 && salaryNum <= 100000) {
    const expectedRange = { min: 1500, max: 15000 }
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
