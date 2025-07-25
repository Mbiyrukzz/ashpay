// controllers/kraDeductions.js - Updated backend KRA calculations

/**
 * Calculate statutory deductions according to Kenyan tax laws
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

  // NHIF - National Hospital Insurance Fund
  let nhif = 0
  if (salary <= 5999) {
    nhif = 150
  } else if (salary <= 7999) {
    nhif = 300
  } else if (salary <= 11999) {
    nhif = 400
  } else if (salary <= 14999) {
    nhif = 500
  } else if (salary <= 19999) {
    nhif = 600
  } else if (salary <= 24999) {
    nhif = 750
  } else if (salary <= 29999) {
    nhif = 850
  } else if (salary <= 34999) {
    nhif = 900
  } else if (salary <= 39999) {
    nhif = 950
  } else if (salary <= 44999) {
    nhif = 1000
  } else if (salary <= 49999) {
    nhif = 1100
  } else if (salary <= 59999) {
    nhif = 1200
  } else if (salary <= 69999) {
    nhif = 1300
  } else if (salary <= 79999) {
    nhif = 1400
  } else if (salary <= 89999) {
    nhif = 1500
  } else if (salary <= 99999) {
    nhif = 1600
  } else {
    nhif = 1700
  }

  deductions.push({
    type: 'NHIF',
    amount: nhif,
    recurring: true,
    description: 'National Hospital Insurance Fund',
  })

  // NSSF - National Social Security Fund (6% of gross, capped at KES 1,080)
  const nssf = Math.min(salary * 0.06, 1080)
  deductions.push({
    type: 'NSSF',
    amount: Math.round(nssf),
    recurring: true,
    description: 'National Social Security Fund (6% capped at KES 1,080)',
  })

  // Housing Levy (1.5% of gross salary)
  const housingLevy = salary * 0.015
  deductions.push({
    type: 'Housing Levy',
    amount: Math.round(housingLevy),
    recurring: true,
    description: 'Affordable Housing Levy (1.5% of gross)',
  })

  // PAYE - Pay As You Earn Income Tax
  let paye = 0
  let payeDescription = ''

  if (salary <= 24000) {
    // No tax for salaries below or equal to KES 24,000
    paye = 0
    payeDescription = 'No PAYE tax (salary ≤ KES 24,000)'
  } else if (salary <= 32333) {
    // 25% on income between KES 24,001 and KES 32,333
    paye = (salary - 24000) * 0.25
    payeDescription = '25% on amount above KES 24,000'
  } else if (salary <= 500000) {
    // 25% on KES 24,001-32,333, then 30% on KES 32,334-500,000
    const tier1 = (32333 - 24000) * 0.25
    const tier2 = (salary - 32333) * 0.3
    paye = tier1 + tier2
    payeDescription = '25% (KES 24,001-32,333) + 30% (above KES 32,333)'
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
      nhif: deductions.find((d) => d.type === 'NHIF')?.amount || 0,
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

  if (salary <= 24000 && payeAmount > 0) {
    return {
      isValid: false,
      warning: `PAYE should be 0 for salaries ≤ KES 24,000. Got KES ${payeAmount}`,
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

module.exports = {
  calculateStatutoryDeductions,
  calculateTotalStatutoryDeductions,
  calculateNetSalary,
  validatePayeCalculation,
}
