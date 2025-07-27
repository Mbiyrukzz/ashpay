/**
 * Calculate statutory deductions according to updated Kenyan tax laws
 * @param {number} grossSalary - The gross salary amount
 * @returns {Array} Array of deduction objects
 */
const calculateStatutoryDeductions = (grossSalary) => {
  if (!grossSalary || isNaN(grossSalary) || grossSalary <= 0) {
    console.warn('Invalid gross salary provided:', grossSalary)
    return []
  }

  const salary = parseFloat(grossSalary)
  const deductions = []

  // SHIF - Social Health Insurance Fund (2.75% of gross salary)
  const shif = salary * 0.0275
  deductions.push({
    type: 'SHIF',
    amount: Math.round(shif),
    recurring: true,
    description: 'Social Health Insurance Fund (2.75% of gross salary)',
  })

  // NSSF - Based on LEL and UEL structure with Tier 1 and Tier 2
  let nssfAmount = 0
  let tier1Amount = 0
  let tier2Amount = 0
  let nssfDescription = ''

  // Lower Earnings Limit (LEL): KES 8,000
  // Upper Earnings Limit (UEL): KES 72,000
  // Employee contributes 6% on pensionable earnings

  const lel = 8000 // Lower Earnings Limit
  const uel = 72000 // Upper Earnings Limit

  // Tier 1: Contribution on earnings up to LEL (KES 8,000)
  if (salary > 0) {
    const tier1Base = Math.min(salary, lel)
    tier1Amount = tier1Base * 0.06 // 6% on earnings up to LEL
  }

  // Tier 2: Contribution on earnings above LEL up to UEL
  if (salary > lel) {
    const tier2Base = Math.min(salary, uel) - lel
    tier2Amount = tier2Base * 0.06 // 6% on earnings between LEL and UEL
  }

  // Total NSSF = Tier 1 + Tier 2, capped at KES 4,320
  nssfAmount = Math.min(tier1Amount + tier2Amount, 4320)

  if (salary <= 0) {
    nssfDescription = 'No NSSF contribution'
  } else if (salary <= lel) {
    nssfDescription = `NSSF Tier 1: 6% on KES ${Math.min(
      salary,
      lel
    ).toLocaleString()}`
  } else {
    const tier1Base = Math.min(salary, lel)
    const tier2Base = Math.min(salary, uel) - lel
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
    tier1Base: Math.min(salary, lel),
    tier2Base: salary > lel ? Math.min(salary, uel) - lel : 0,
  })

  // Housing Levy (1.5% of gross salary)
  const housingLevy = salary * 0.015
  deductions.push({
    type: 'Housing Levy',
    amount: Math.round(housingLevy),
    recurring: true,
    description: 'Affordable Housing Levy (1.5% of gross)',
  })

  // PAYE - Pay As You Earn Income Tax (Updated to start from KES 27,000)
  let paye = 0
  let payeDescription = ''

  if (salary <= 24000) {
    // No tax for salaries below or equal to KES 27,000
    paye = 0
    payeDescription = 'No PAYE tax (salary ≤ KES 27,000)'
  } else if (salary <= 32333) {
    // 25% on income between KES 27,001 and KES 32,333
    paye = (salary - 24000) * 0.25
    payeDescription = '25% on amount above KES 27,000'
  } else if (salary <= 500000) {
    // 25% on KES 27,001-32,333, then 30% on KES 32,334-500,000
    const tier1 = (32333 - 24000) * 0.25
    const tier2 = (salary - 32333) * 0.3
    paye = tier1 + tier2
    payeDescription = '25% (KES 27,001-32,333) + 30% (above KES 32,333)'
  } else if (salary <= 800000) {
    // Previous tiers + 32.5% on KES 500,001-800,000
    const tier1 = (32333 - 24000) * 0.25
    const tier2 = (500000 - 32333) * 0.3
    const tier3 = (salary - 500000) * 0.325
    paye = tier1 + tier2 + tier3
    payeDescription = 'Progressive rates up to 32.5%'
  } else {
    // All previous tiers + 35% on amount above KES 800,000
    const tier1 = (32333 - 24000) * 0.25
    const tier2 = (500000 - 32333) * 0.3
    const tier3 = (800000 - 500000) * 0.325
    const tier4 = (salary - 800000) * 0.35
    paye = tier1 + tier2 + tier3 + tier4
    payeDescription = 'Progressive rates up to 35%'
  }

  // Apply monthly personal relief of KES 2,400
  const personalRelief = 2400
  const grossPaye = paye
  paye = Math.max(paye - personalRelief, 0)

  // Add PAYE deduction (even if 0, for transparency)
  deductions.push({
    type: 'PAYE',
    amount: Math.round(paye),
    recurring: true,
    description: `${payeDescription}${
      grossPaye > 0 ? ' (less KES 2,400 personal relief)' : ''
    }`,
    grossAmount: Math.round(grossPaye),
    personalRelief: grossPaye > 0 ? personalRelief : 0,
  })

  console.log(
    `Calculated statutory deductions for salary KES ${salary.toLocaleString()}:`,
    deductions.map((d) => `${d.type}: KES ${d.amount.toLocaleString()}`)
  )

  return deductions
}

/**
 * Calculate total statutory deductions
 * @param {number} grossSalary - The gross salary amount
 * @returns {number} Total deductions amount
 */
const calculateTotalStatutoryDeductions = (grossSalary) => {
  const deductions = calculateStatutoryDeductions(grossSalary)
  return deductions.reduce((total, deduction) => total + deduction.amount, 0)
}

/**
 * Calculate net salary after statutory deductions
 * @param {number} grossSalary - The gross salary amount
 * @returns {Object} Salary breakdown
 */
const calculateNetSalary = (grossSalary) => {
  const deductions = calculateStatutoryDeductions(grossSalary)
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0)

  return {
    grossSalary: parseFloat(grossSalary),
    deductions,
    totalDeductions,
    netSalary: grossSalary - totalDeductions,
    breakdown: {
      shif: deductions.find((d) => d.type === 'SHIF')?.amount || 0,
      nssf: deductions.find((d) => d.type === 'NSSF')?.amount || 0,
      housingLevy:
        deductions.find((d) => d.type === 'Housing Levy')?.amount || 0,
      paye: deductions.find((d) => d.type === 'PAYE')?.amount || 0,
    },
  }
}

/**
 * Validate if calculated PAYE seems correct
 * @param {number} grossSalary - The gross salary
 * @param {number} payeAmount - Calculated PAYE amount
 * @returns {Object} Validation result
 */
const validatePayeCalculation = (grossSalary, payeAmount) => {
  const salary = parseFloat(grossSalary)

  // Updated validation for new PAYE threshold (KES 27,000)
  if (salary <= 24000 && payeAmount > 0) {
    return {
      isValid: false,
      warning: `PAYE should be 0 for salaries ≤ KES 27,000. Got KES ${payeAmount}`,
    }
  }

  if (salary > 24000 && salary <= 32333) {
    const expectedPaye = Math.max((salary - 24000) * 0.25 - 2400, 0)
    const tolerance = 100 // Allow KES 100 tolerance for rounding

    if (Math.abs(payeAmount - expectedPaye) > tolerance) {
      return {
        isValid: false,
        warning: `PAYE calculation may be incorrect. Expected ~KES ${Math.round(
          expectedPaye
        )}, got KES ${payeAmount}`,
      }
    }
  }

  return { isValid: true, warning: null }
}

/**
 * Get detailed NSSF breakdown for transparency based on LEL/UEL structure with Tiers
 * @param {number} grossSalary - The gross salary amount
 * @returns {Object} NSSF breakdown
 */
const getNssfBreakdown = (grossSalary) => {
  const salary = parseFloat(grossSalary)

  const lel = 8000 // Lower Earnings Limit
  const uel = 72000 // Upper Earnings Limit

  let tier1EmployeeContribution = 0
  let tier1EmployerContribution = 0
  let tier2EmployeeContribution = 0
  let tier2EmployerContribution = 0
  let tier1Base = 0
  let tier2Base = 0

  // Tier 1: Contribution on earnings up to LEL (KES 8,000)
  if (salary > 0) {
    tier1Base = Math.min(salary, lel)
    tier1EmployeeContribution = tier1Base * 0.06 // 6% employee
    tier1EmployerContribution = tier1Base * 0.06 // 6% employer
  }

  // Tier 2: Contribution on earnings above LEL up to UEL
  if (salary > lel) {
    tier2Base = Math.min(salary, uel) - lel
    tier2EmployeeContribution = tier2Base * 0.06 // 6% employee
    tier2EmployerContribution = tier2Base * 0.06 // 6% employer
  }

  // Calculate totals (before capping)
  const totalEmployeeBeforeCap =
    tier1EmployeeContribution + tier2EmployeeContribution
  const totalEmployerBeforeCap =
    tier1EmployerContribution + tier2EmployerContribution

  // Apply cap of KES 4,320 each
  const totalEmployee = Math.min(totalEmployeeBeforeCap, 4320)
  const totalEmployer = Math.min(totalEmployerBeforeCap, 4320)

  return {
    lel,
    uel,
    salary,
    tier1: {
      base: tier1Base,
      employee: Math.round(tier1EmployeeContribution),
      employer: Math.round(tier1EmployerContribution),
      total: Math.round(tier1EmployeeContribution + tier1EmployerContribution),
      description: `6% each on earnings up to KES ${lel.toLocaleString()}`,
    },
    tier2: {
      base: tier2Base,
      employee: Math.round(tier2EmployeeContribution),
      employer: Math.round(tier2EmployerContribution),
      total: Math.round(tier2EmployeeContribution + tier2EmployerContribution),
      description: `6% each on earnings from KES ${(
        lel + 1
      ).toLocaleString()} to KES ${uel.toLocaleString()}`,
    },
    totalEmployee: Math.round(totalEmployee),
    totalEmployer: Math.round(totalEmployer),
    totalContribution: Math.round(totalEmployee + totalEmployer),
    maxMonthlyContribution: 8640, // KES 4,320 each from employee and employer
    contributionRate: '6% each (employee and employer)',
    isCapped: totalEmployeeBeforeCap > 4320 || totalEmployerBeforeCap > 4320,
    description:
      salary <= 0
        ? 'No contribution required'
        : salary <= lel
        ? `Tier 1 only: 6% each on KES ${tier1Base.toLocaleString()}`
        : `Tier 1: 6% each on KES ${tier1Base.toLocaleString()} + Tier 2: 6% each on KES ${tier2Base.toLocaleString()}${
            totalEmployeeBeforeCap > 4320 ? ' (capped at KES 4,320 each)' : ''
          }`,
  }
}

module.exports = {
  calculateStatutoryDeductions,
  calculateTotalStatutoryDeductions,
  calculateNetSalary,
  validatePayeCalculation,
  getNssfBreakdown,
}
