import type { Profile } from '@/stores/profiles'

export default class ProfileCalculations {
  constructor(private profile : Profile) {}

  annualCashFlow() : number {
    return this.monthlyCashFlow() * 12
  }

  availableAnnualDaysOff(monthlyFee? : number) : number {
    if (!this.profile.monthly_salary) {
      return 0
    }
    const count = Math.floor(
      // Available cash flow for days off...
      (this.maximumAvailableAnnualCashFlow(monthlyFee) - this.annualCashFlow()) /
      // ...divided by the charged salary by day.
      (this.chargedSalary() / this.averageDaysOfWorkByMonth())
    )
    if (!isFinite(count)) {
      return this.profile.days_off
    }
    return count
  }

  averageDaysOfWorkByMonth() : number {
    return this.averageDaysOfWorkByYear() / 12
  }

  averageDaysOfWorkByYear() : number {
    // 365 days minus 104 saturdays/sundays minus annual leaves and public holidays.
    return 365 - 104 - this.profile.days_off - 7
  }

  chargedSalary() : number {
    return this.toNumber(this.profile.monthly_salary) * this.chargesRatio()
  }

  chargesRatio() : number {
    return 1.43
  }

  dailyFee() : number {
    return this.monthlyFee() / (this.profile.days_of_work * 4)
  }

  // This calculation looks like `potentialAccountingResult()` except that we subtract
  // future URSSAF charges.
  maximumAvailableAnnualCashFlow(monthlyFee? : number) : number {
    if (!this.profile.monthly_salary) {
      return 0
    }
    return this.potentialAnnualSales(monthlyFee) -
           (this.monthlyCosts() * 12) -
           (this.chargedSalary() * 12) -
           this.maximumCFE(monthlyFee) -
           this.potentialIS(monthlyFee)
  }

  // https://entreprendre.service-public.fr/vosdroits/F23547
  maximumCFE(monthlyFee? : number) : number {
    if (!this.profile.cfe_enabled) return 0
    if (!this.profile.monthly_salary) return 0
    if (this.potentialAnnualSales(monthlyFee) <= 5_000) return 0
    if (this.potentialAnnualSales(monthlyFee) <= 10_000) return 534
    if (this.potentialAnnualSales(monthlyFee) <= 32_600) return 1067
    if (this.potentialAnnualSales(monthlyFee) <= 100_000) return 2242
    if (this.potentialAnnualSales(monthlyFee) <= 250_000) return 3738
    if (this.potentialAnnualSales(monthlyFee) <= 500_000) return 5339
    return 6942
  }

  monthlyCashFlow() : number {
    if (!this.profile.monthly_cash_flow_enabled) {
      return 0
    }
    return this.toNumber(this.profile.monthly_cash_flow)
  }

  monthlyCosts() : number {
    let total = 0
    for (const monthlyCost of this.profile.monthly_costs.values()) {
      if (monthlyCost.enabled) {
        total += this.toNumber(monthlyCost.amount)
      }
    }
    return total
  }

  monthlyFee() : number {
    // Calculate the base amount.
    const base =
      this.monthlyCosts() +
      this.chargedSalary() +
      this.toNumber(this.profile.monthly_cash_flow) +
      // This add days of annual leave so on those days we can still take a salary.
      (
        // The number of days off we can take by month.
        (
          this.profile.days_off / 12
        ) *
        // The charged salary by day.
        (
          this.chargedSalary() / this.averageDaysOfWorkByMonth()
        )
      )
    if (base == 0) {
      return 0
    }
    // Calculate the adjustment ratio to compensate annual taxes which are based on
    // annual sales, hence a nasty loop to take care of. Indeed, when we try to compensate
    // the taxes, these tend to grow exponentially. Then, we need to find the ideal
    // threshold.
    let total = base
    if (this.profile.cfe_enabled || this.profile.is_enabled) {
      let ratio = 1
      do {
        const cfe = this.profile.cfe_enabled ? this.maximumCFE(base) : 0
        const is = this.profile.is_enabled ? this.potentialIS(base) : 0
        total = base + (((cfe + is) / 12) * ratio)
        ratio += 0.05
        if (ratio > 10) {
          console.log('Maximum threshold reached')
          return 0
        }
      }
      while(this.availableAnnualDaysOff(total) < Number(this.profile.days_off))
    }
    // Apply freelacing platform fees.
    if (this.profile.freelancing_platform_enabled) {
      switch (this.profile.freelancing_platform) {
        case 'malt':
          total *= 1.1
          break
        case 'comet':
          total += (this.profile.days_of_work * 4) * 29
          break
      }
    }
    // Return the final fee.
    return total
  }

  potentialAccountingResult(monthlyFee? : number) : number {
    return this.potentialAnnualSales(monthlyFee) -
           (this.monthlyCosts() * 12) -
           (this.toNumber(this.profile.monthly_salary) * 12)
  }

  potentialAnnualSales(monthlyFee? : number) : number {
    return (monthlyFee || this.monthlyFee()) * 12
  }

  // https://www.impots.gouv.fr/international-professionnel/impot-sur-les-societes
  potentialIS(monthlyFee? : number) : number {
    if (!this.profile.is_enabled) {
      return 0
    }
    if (!this.profile.monthly_salary) {
      return 0
    }
    const accounting_result = this.potentialAccountingResult(monthlyFee)
    return accounting_result <= 38120 ?
           accounting_result * 0.15 :
           accounting_result * 0.25
  }

  toNumber(value? : string | number) {
    if (value === null || value === undefined) {
      return 0
    }
    if (typeof value == 'string') {
      return Number(value.trim().replace(',', '.'))
    }
    return value
  }
}
