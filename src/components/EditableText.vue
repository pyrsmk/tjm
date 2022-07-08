<script setup lang="ts">
  import { ref } from 'vue'
  import BorderRevealButton from '@/components/BorderRevealButton.vue'

  const opened = ref<boolean>(false)
</script>

<template>
  <div class="editable" @click="opened=!opened">
    <slot name="text"></slot>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/>
    </svg>
  </div>
  <div v-if="opened" class="edit">
    <slot name="edit"></slot>
    <div class="button">
      <BorderRevealButton @click="opened=false">Valider</BorderRevealButton>
    </div>
  </div>
</template>

<style lang="sass" scoped>
  .editable
    cursor: pointer
    display: inline-block

    svg
      fill: var(--shocking-pink)
      height: 24px
      opacity: 0
      transition: all 250ms
      width: 24px

    &:hover svg,
    &:focus svg
      opacity: 1

    &:active svg
      fill: var(--blackcurrant)

  .button
    margin-top: var(--margin)
    text-align: center
</style>
