export function prepareEmployeePayload(formData) {
  const {
    name,
    email,
    phone,
    department,
    position,
    salary,
    deductions = [],
    benefitOverrides = {},
    excludedBenefits = [],
    bankName,
    accountNumber,
    accountName,
    employeeId,
    photo,
  } = formData

  return {
    name,
    email,
    phone,
    department,
    position,
    salary: Number(salary),
    deductions: deductions.map((d) =>
      typeof d === 'string' ? { type: d, amount: 0 } : d
    ),
    benefits: {
      benefitOverrides,
      excludedBenefits,
    },
    bankDetails:
      bankName || accountNumber || accountName
        ? {
            bankName,
            accountNumber,
            accountName,
          }
        : undefined,
    employeeId,
    photo,
  }
}
