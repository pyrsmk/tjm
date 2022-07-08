<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { toEuros } from '@/helpers'
  import { useProfileStore } from '@/stores/profiles'
  import { useRoute } from 'vue-router'
  import { v4 as uuidv4 } from 'uuid'
  import ActivationCheckbox from '@/components/ActivationCheckbox.vue'
  import BlockTitle from '@/components/BlockTitle.vue'
  import DeleteButton from '@/components/DeleteButton.vue'
  import EditableText from '@/components/EditableText.vue'
  import PageLayout from '@/layouts/PageLayout.vue'
  import PageTitle from '@/components/PageTitle.vue'
  import ProfileCalculations from '@/classes/ProfileCalculations'

  const route = useRoute()
  const profileStore = useProfileStore()
  const profile = await profileStore.fetch(route.params.id as string)
  const calculations = new ProfileCalculations(profile)

  const monthlyCostAmount = ref<string>('')
  const monthlyCostName = ref<string>('')
  const monthlyCostNameInput = ref<HTMLElement | null>(null)

  function addCurrentMonthlyCost() : void {
    const n = monthlyCostName.value.trim()
    const a = monthlyCostAmount.value.trim()
    if (!n || !a) {
      return
    }
    profile.monthly_costs.set(uuidv4(), { enabled: true, name: n, amount: a })
    monthlyCostName.value = ''
    monthlyCostAmount.value = '';
    (monthlyCostNameInput.value as HTMLElement).focus()
  }

  function removeMonthlyCost(id : string) : void {
    profile.monthly_costs.delete(id)
  }

  // Re-enable `freelancing_platform` whenever the user updates it.
  watch(
    () => profile.freelancing_platform,
    () => {
      if (profile.freelancing_platform !== null) {
        profile.freelancing_platform_enabled = true
      }
    }
  )
</script>

<template>
  <PageLayout>
    <EditableText>
      <template v-slot:text>
        <PageTitle>
          {{ profile.name }} ({{ profile.type.toLocaleUpperCase() }})
        </PageTitle>
      </template>
      <template v-slot:edit>
        <div class="company_form">
          <div class="block">
            <label for="name">Nom du profil</label>
            <input type="text" id="name" v-model.lazy="profile.name" />
          </div>
          <div class="block">
            <label for="type">Type de votre structure</label>
            <select id="type" v-model="profile.type">
              <option disabled :value="null">Sélectionner un type</option>
              <option value="eurl">EURL</option>
            </select>
          </div>
        </div>
      </template>
    </EditableText>
    <div class="layout">
      <div>
        <div class="work_details">
          <div class="title">
            <BlockTitle>Critères de travail</BlockTitle>
          </div>
          <div class="block">
            <label for="days_of_work">Jours de travail / semaine</label>
            <input
              type="number"
              id="days_of_work"
              min="1"
              max="7"
              v-model="profile.days_of_work"
            />
          </div>
          <div class="block">
            <label for="monthly_salary">Salaire mensuel désiré</label>
            <input type="text" id="monthly_salary" v-model="profile.monthly_salary" />
          </div>
          <div class="block activable">
            <ActivationCheckbox v-model="profile.monthly_cash_flow_enabled" />
            <label for="monthly_cash_flow">Trésorerie mensuelle</label>
            <input
              type="text"
              id="monthly_cash_flow"
              v-model="profile.monthly_cash_flow"
            />
          </div>
          <div class="block">
            <label for="days_off">Jours de congés annuel</label>
            <input type="number" id="days_off" v-model="profile.days_off" />
          </div>
          <div class="block activable">
            <ActivationCheckbox v-model="profile.freelancing_platform_enabled" />
            <label for="freelancing_platform">Plateforme de freelancing</label>
            <select
              id="freelancing_platform"
              v-model="profile.freelancing_platform"
            >
              <option :value="null">---</option>
              <option value="malt">Malt</option>
              <option value="comet">Comet</option>
            </select>
          </div>
        </div>
        <div class="monthly_costs">
          <div class="title">
            <BlockTitle>Charges mensuelles</BlockTitle>
          </div>
          <ul class="costs">
            <li
              v-for="[id, cost] in profile.monthly_costs"
              v-bind:key="id"
              class="activable"
            >
              <ActivationCheckbox v-model="cost.enabled" />
              <input type="text" v-model="cost.name" />
              <input type="text" v-model="cost.amount" />
              <DeleteButton @click="removeMonthlyCost(id)" />
            </li>
          </ul>
          <div class="inputs">
            <input
              ref="monthlyCostNameInput"
              type="text"
              v-model="monthlyCostName"
              @keyup.enter="addCurrentMonthlyCost()"
              placeholder="Libellé"
            />
            <input
              v-model="monthlyCostAmount"
              type="text"
              @keyup.enter="addCurrentMonthlyCost()"
              placeholder="123.45"
            />
          </div>
          <div class="total">
            <span>Total</span>
            <span>
              {{ toEuros(calculations.monthlyCosts()) }}
            </span>
          </div>
        </div>
      </div>
      <div>
        <div class="results">
          <div class="title">
            <BlockTitle>Résultats salariaux (mensuel)</BlockTitle>
          </div>
          <div class="block">
            <label for="salary_with_costs">Salaire chargé</label>
            <span id="salary_with_costs">
              {{ toEuros(calculations.chargedSalary()) }}
            </span>
          </div>
          <div class="block">
            <label for="monthly_fee">Forfait mensuel</label>
            <span id="monthly_fee">
              {{ toEuros(calculations.monthlyFee()) }}
            </span>
          </div>
          <div class="block">
            <label for="daily_fee">Forfait journalier</label>
            <span id="daily_fee">
              {{ toEuros(calculations.dailyFee()) }}
            </span>
          </div>
        </div>
        <div class="results">
          <div class="title">
            <BlockTitle>Résultats fiscaux (annuel)</BlockTitle>
          </div>
          <div class="block activable">
            <ActivationCheckbox v-model="profile.cfe_enabled" />
            <label for="cfe">CFE maximale</label>
            <span id="cfe">
              {{ toEuros(calculations.maximumCFE()) }}
            </span>
          </div>
          <div class="block activable">
            <ActivationCheckbox v-model="profile.is_enabled" />
            <label for="is">IS potentiel</label>
            <span id="is">
              {{ toEuros(calculations.potentialIS()) }}
            </span>
          </div>
          <div class="block">
            <label for="annual_cash_flow_without_taxes">Tréso. après taxes</label>
            <span id="annual_cash_flow_without_taxes">
              {{ toEuros(calculations.maximumAvailableAnnualCashFlow()) }}
            </span>
          </div>
          <div class="block">
            <label for="available_days_off">Jours de congés disponibles</label>
            <span id="available_days_off">
              {{ calculations.availableAnnualDaysOff() }}
            </span>
          </div>
          <div class="block">
            <label for="cash_flow_without_days_off">Tréso. après congés</label>
            <span id="cash_flow_without_days_off">
              {{ toEuros(calculations.annualCashFlow()) }}
            </span>
          </div>
        </div>
        <div class="notes">
          <div class="title">
            <BlockTitle>Notes diverses</BlockTitle>
            <textarea v-model="profile.notes"></textarea>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<style lang="sass" scoped>
  .company_form
    margin-top: calc(var(--margin) * 1.5)

    input,
    select
      width: 100%

    select
      cursor: pointer

    .block + .block
      margin-top: var(--margin)

  .layout
    @media screen and (min-width: 50em)
      display: grid
      grid-template-columns: 1fr 1fr
      grid-gap: calc(var(--margin) * 4)

      & > div:first-child
        grid-column: 1

      & > div:second-child
        grid-column: 2

  .title
    margin-bottom: var(--margin)

  .monthly_costs,
  .work_details,
  .results,
  .notes
    margin-top: calc(var(--margin) * 2)

  .monthly_costs .costs li,
  .monthly_costs .inputs,
  .work_details .block,
  .results .block
    display: flex
    position: relative

    input
      // https://stackoverflow.com/a/42421490/4112863
      min-width: 0
      height: 1.5em

    :first-child
      flex-grow: 2

    :nth-child(2)
      width: 75px

  .activable
    :first-child
      flex-grow: 1

    :nth-child(2)
      flex-grow: 2

    :nth-child(3)
      width: 75px

  .monthly_costs
    .costs
      list-style-type: none
      margin: 0 0 var(--small-margin) 0
      padding: 0

      li + li
        margin-top: var(--small-margin)

    .inputs
      // The whole place minus the size of the delete button.
      width: calc(100% - 24px)

    .total
      display: flex
      margin-top: 0.5em
      padding-left: 0.15em
      // The whole place minus the size of the delete button.
      width: calc(100% - 24px)

      :nth-child(2)
        background: var(--magic-mint)
        padding: 0 0.3em
        text-align: right
        white-space: nowrap
        min-width: 125px

      span:first-child
        flex-grow: 2

  .work_details
    .block + .block
      margin-top: var(--small-margin)

  .results
    span
      background: var(--magic-mint)
      padding: 0 0.3em
      white-space: nowrap

    .block
      :nth-child(2)
        text-align: right
        min-width: 125px

      &.activable
        :nth-child(2)
          text-align: left
          min-width: auto

        :nth-child(3)
          text-align: right
          min-width: 125px

  .notes
    textarea
      display: block
      margin-top: var(--margin)
      min-height: 8em
      width: 100%
</style>
