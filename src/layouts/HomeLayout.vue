<script setup lang="ts">
  import BaseLayout from '@/layouts/BaseLayout.vue'
  import BigSiteTitle from '@/components/BigSiteTitle.vue'
</script>

<template>
  <BaseLayout>
    <div class="wrapper">
      <div class="title">
        <BigSiteTitle />
      </div>
      <main>
        <slot />
      </main>
    </div>
  </BaseLayout>
</template>

<style lang="sass" scoped>
  .wrapper
    border-top: var(--margin) solid var(--shocking-pink)
    padding: calc(var(--margin) * 2)

    & > *
      text-align: center

  .title
    // We remove 2em from `top` property since it's already applied from body's padding.
    margin: var(--margin) 0 calc(var(--margin) * 3) 0

  main
    margin: calc(var(--margin) * 2) 0
</style>
