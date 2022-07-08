<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{ theme?: 'normal' | 'inverted' }>()
  const theme = computed(() => props.theme ?? 'normal')
</script>

<template>
  <button @click="$emit('click')" :class="theme">
    <slot />
  </button>
</template>

<style lang="sass" scoped>
  .normal
    --color1: var(--shocking-pink)
    --color2: var(--polar)

  .inverted
    --color1: var(--polar)
    --color2: var(--shocking-pink)

  button
    background: transparent
    border: 0
    color: var(--color1)
    cursor: pointer
    padding: calc(var(--margin) * 0.5)
    position: relative
    transition: all 250ms

    &:before
      border-left: 3px solid var(--color1)
      border-top: 3px solid var(--color1)
      content: ''
      height: 0
      left: 0
      opacity: 0
      position: absolute
      top: 0
      transition: all 250ms
      width: 0

    &:after
      border-right: 3px solid var(--color1)
      border-bottom: 3px solid var(--color1)
      content: ''
      height: 0
      right: 0
      opacity: 0
      position: absolute
      bottom: 0
      transition: all 250ms
      width: 0

    &:hover:before,
    &:focus:before
      height: 100%
      opacity: 1
      width: 100%

    &:hover:after,
    &:focus:after
      height: 100%
      opacity: 1
      width: 100%

    &:active
      background: var(--color1)
      color: var(--color2)
</style>
