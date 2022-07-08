<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import BaseLayout from '@/layouts/BaseLayout.vue'
  import BorderRevealButton from '@/components/BorderRevealButton.vue'
  import SmallSiteTitle from '@/components/SmallSiteTitle.vue'
</script>

<template>
  <BaseLayout>
    <nav>
      <div>
        <div class="title">
          <RouterLink :to="{ name: 'profile_list' }" custom v-slot="{ navigate }">
            <SmallSiteTitle @click="navigate" />
          </RouterLink>
        </div>
      </div>
      <RouterLink :to="{ name: 'profile_list' }" custom v-slot="{ navigate }">
        <BorderRevealButton @click="navigate" theme="inverted">
          Liste des profils
        </BorderRevealButton>
      </RouterLink>
    </nav>
    <main>
      <slot />
    </main>
  </BaseLayout>
</template>

<style lang="sass" scoped>
  nav
    background: var(--shocking-pink)
    display: flex
    align-items: center
    padding: calc(var(--margin) * 0.5)

    & > div
      flex-grow: 2

      .title
        cursor: pointer
        display: inline

  main
    margin: 0 auto
    max-width: 60em // 960px
    padding: calc(var(--margin) * 2)
</style>
