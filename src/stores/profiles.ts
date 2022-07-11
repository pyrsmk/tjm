import { defineStore } from 'pinia'
import Storage from '@/classes/Storage'

const storage = new Storage()

export enum CompanyType {
  EURL = 'EURL',
}

export type MonthlyCost = {
  amount: string | number
  enabled: boolean,
  name: string,
}

export interface Profile {
  id: string,
  name: string,
  type: CompanyType,

  cfe_enabled: boolean,
  days_of_work: number,
  days_off: number,
  freelancing_platform_enabled: boolean,
  freelancing_platform?: string,
  is_enabled: boolean,
  monthly_cash_flow_enabled: boolean,
  monthly_cash_flow?: string | number,
  monthly_costs: Map<string, MonthlyCost>,
  monthly_salary?: string | number,
  notes?: string | string[],
}

export const baseProfile = {
  cfe_enabled: true,
  days_of_work: 5,
  days_off: 25,
  freelancing_platform_enabled: false,
  monthly_cash_flow_enabled: true,
  monthly_costs: new Map()
}

export const useProfileStore = defineStore('profiles', {
  state: () => ({
    initialized: false,
    // Should not be used directly. Instead, call store actions.
    list: new Array<Profile>,
  }),
  actions: {
    async add(profile : Profile) : Promise<void> {
      await initialize()
      this.list.push(profile)
      this.list.sort()
      await storage.set('profiles', this.list)
    },
    async fetch(id : string) : Promise<Profile> {
      await initialize()
      const profile = this.list.find(profile => profile.id == id)
      if (profile === undefined) {
        throw new Error(`'${id}' profile not found`)
      }
      return profile
    },
    async fetchAll() : Promise<Array<Profile>> {
      await initialize()
      return this.list
    },
    async remove(id : string) : Promise<void> {
      await initialize()
      const index = this.list.findIndex(profile => profile.id == id)
      if (index == -1) {
        throw new Error(`'${id}' profile does not exist`)
      }
      this.list.splice(index, 1)
      await storage.set('profiles', this.list)
    }
  }
})

// Populate the profile list and add a listener to save changes at each state change.
async function initialize() : Promise<void> {
  const store = useProfileStore()
  if (store.initialized) {
    return
  }
  try {
    for (const profile of await storage.get('profiles')) {
      store.list.push(profile)
    }
  } catch (error) {
    // Usually, this is triggered when no data has been found. But an error can be
    // thrown from JSON parsing algorithm so let's keep some debug messages.
    console.error(error)
  } finally {
    store.$subscribe(async (mutation, state) => {
      await storage.set('profiles', state.list)
    })
    store.initialized = true
  }
}
