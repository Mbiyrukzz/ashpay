// src/utils/kraDeductions.js
export function calculateKraDeductions(salary) {
  const deductions = []

  // NHIF
  let nhif = 0
  if (salary <= 5999) nhif = 150
  else if (salary <= 7999) nhif = 300
  else if (salary <= 11999) nhif = 400
  else if (salary <= 14999) nhif = 500
  else if (salary <= 19999) nhif = 600
  else if (salary <= 24999) nhif = 750
  else if (salary <= 29999) nhif = 850
  else if (salary <= 34999) nhif = 900
  else if (salary <= 39999) nhif = 950
  else if (salary <= 44999) nhif = 1000
  else if (salary <= 49999) nhif = 1100
  else nhif = 1700
  deductions.push({ type: 'NHIF', amount: nhif })

  // NSSF (Tier I)
  const nssf = Math.min(salary, 6000) * 0.06
  deductions.push({ type: 'NSSF', amount: Math.round(nssf) })

  // Housing Levy
  const housingLevy = salary * 0.015
  deductions.push({ type: 'Housing Levy', amount: Math.round(housingLevy) })

  // PAYE
  let paye = 0
  let remaining = salary

  if (remaining > 32333) {
    paye += (remaining - 32333) * 0.3
    remaining = 32333
  }
  if (remaining > 24000) {
    paye += (remaining - 24000) * 0.25
    remaining = 24000
  }
  if (remaining > 0) {
    paye += remaining * 0.1
  }

  paye = Math.max(paye - 2400, 0)
  deductions.push({ type: 'PAYE', amount: Math.round(paye) })

  return deductions
}
