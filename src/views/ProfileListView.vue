<script setup lang="ts">
  import { busy } from '@/helpers'
  import { RouterLink } from 'vue-router'
  import { useProfileStore, CompanyType } from '@/stores/profiles'
  import { v4 as uuidv4 } from 'uuid'
  import BorderRevealButton from '@/components/BorderRevealButton.vue'
  import CopyButton from '@/components/CopyButton.vue'
  import DeleteButton from '@/components/DeleteButton.vue'
  import HomeLayout from '@/layouts/HomeLayout.vue'
  import InfoMessage from '@/components/InfoMessage.vue'

  const store = useProfileStore()
  const profiles = await store.fetchAll()

  async function duplicateProfile(id : string) {
    const profile = await store.fetch(id)
    await store.add({ ...profile, id: uuidv4() })
  }

  async function removeProfile(id : string) {
    if (confirm(`Supprimer le profil '${(await store.fetch(id)).name}' ?`)) {
      await store.remove(id)
    }
  }
</script>

<template>
  <HomeLayout>
    <div class="wrapper">
      <div v-if="profiles.length == 0">
        <InfoMessage>
          Aucun profil trouvé, il est temps d'aller en créer un !
        </InfoMessage>
      </div>
      <ul v-else>
        <li v-for="profile in profiles" v-bind:key="profile.id">
          <RouterLink
            :to="{ name: 'profile', params: { id: profile.id } }"
            v-slot="{ navigate, href }"
            custom
          >
            <a :href="href" @click="navigate">
              {{ profile.name }} ({{ CompanyType[profile.type] }})
            </a>
            <CopyButton @click="busy(() => duplicateProfile(profile.id))">
              Dupliquer
            </CopyButton>
            <DeleteButton @click="busy(() => removeProfile(profile.id))">
              Supprimer
            </DeleteButton>
          </RouterLink>
        </li>
      </ul>
      <div class="button">
        <RouterLink :to="{ name: 'new_profile' }" custom v-slot="{ navigate }">
          <BorderRevealButton @click="navigate">Créer un nouveau profil</BorderRevealButton>
        </RouterLink>
      </div>
    </div>
  </HomeLayout>
</template>

<style lang="sass" scoped>
  .wrapper
    margin: 0 auto
    max-width: 30em // 480px

  ul
    list-style-type: none
    padding: 0
    text-align: left

    li
      display: flex

      a
        flex-grow: 2
        color: var(--blackcurrant)
        text-decoration: none
        transition: all 100ms

        &:hover,
        &:focus
          color: var(--shocking-pink)

  .button
    margin-top: 2em
</style>
