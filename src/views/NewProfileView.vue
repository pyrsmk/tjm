<script setup lang="ts">
  import { busy } from '@/helpers'
  import { ref } from 'vue'
  import { useProfileStore, CompanyType, baseProfile } from '@/stores/profiles'
  import { useRouter } from 'vue-router'
  import { v4 as uuidv4 } from 'uuid'
  import BorderRevealButton from '@/components/BorderRevealButton.vue'
  import PageLayout from '@/layouts/PageLayout.vue'
  import PageTitle from '@/components/PageTitle.vue'

  const router = useRouter()
  const store = useProfileStore()
  const name = ref(null)
  const type = ref('eurl')

  async function createProfile() {
    if (name.value === null) {
      throw new Error('Profile name cannot be null')
    }
    const id = uuidv4()
    await store.add({
      ...baseProfile,
      id,
      name: name.value,
      type: CompanyType[type.value as keyof typeof CompanyType],
      is_enabled: true
    })
    router.push({ name: 'profile', params: { id } })
  }
</script>

<template>
  <PageLayout>
    <div class="form">
      <div class="title">
        <PageTitle>Nouveau profil</PageTitle>
      </div>
      <div class="block">
        <label for="name">Nom du profil</label>
        <input type="text" id="name" v-model="name" @keyup.enter="busy(createProfile)" />
      </div>
      <div class="block">
        <label for="type">Type de votre structure</label>
        <select id="type" v-model="type">
          <option disabled :value="null">Sélectionner un type</option>
          <option v-for="key in Object.keys(CompanyType)" v-bind:key="key" :value="key">
            {{ CompanyType[key as keyof typeof CompanyType] }}
          </option>
        </select>
      </div>
      <div class="button">
        <BorderRevealButton @click="busy(createProfile)">
          Créer le profil
        </BorderRevealButton>
      </div>
    </div>
  </PageLayout>
</template>

<style lang="sass" scoped>
  .form
    margin: 0 auto
    max-width: 30em // 480px

  .title
    margin-bottom: 1.5em

  input,
  select
    width: 100%

  select
    cursor: pointer

  .block + .block
    margin-top: 1em

  .button
    margin-top: 2em
    text-align: center
</style>
