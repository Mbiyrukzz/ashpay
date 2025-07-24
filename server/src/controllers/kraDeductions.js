const getPAYE = (gross) => {
  // Simplified PAYE bands
  if (gross <= 24000) return gross * 0.1
  if (gross <= 32333) return 24000 * 0.1 + (gross - 24000) * 0.25
  return 24000 * 0.1 + 8333 * 0.25 + (gross - 32333) * 0.3
}

const getNHIF = (gross) => {
  // Simplified NHIF rates (real rates are banded)
  if (gross <= 5999) return 150
  if (gross <= 7999) return 300
  if (gross <= 11999) return 400
  return 1700 // max tier
}

const getNSSF = (gross) => Math.min(gross * 0.06, 1080)

const getHousingLevy = (gross) => gross * 0.015

const getHELB = (gross, hasHELB = false) => (hasHELB ? gross * 0.05 : 0)

const calculateStatutoryDeductions = (gross, hasHELB = false) => {
  return [
    { type: 'PAYE', amount: Math.round(getPAYE(gross)), recurring: true },
    { type: 'NHIF', amount: getNHIF(gross), recurring: true },
    { type: 'NSSF', amount: getNSSF(gross), recurring: true },
    { type: 'Housing Levy', amount: getHousingLevy(gross), recurring: true },
    ...(hasHELB
      ? [{ type: 'HELB', amount: getHELB(gross), recurring: true }]
      : []),
  ]
}

module.exports = { calculateStatutoryDeductions }
