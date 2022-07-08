<script setup lang="ts">
  const props = defineProps<{
    width: number,
    height: number,
  }>()

  const style = {
    width: `${props.width}px`,
    height: `${props.height}px`,
  }
</script>

<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>

<style lang="sass" scoped>
  div
    cursor: pointer
    position: relative
    overflow: hidden

    :slotted(svg)
      position: relative
      z-index: 2

    :slotted(svg path)
      fill: var(--river-bed)
      transition: all 500ms

    &:hover > :slotted(svg path),
    &:focus > :slotted(svg path),
    &:active > :slotted(svg path)
      fill: var(--polar)

    &:before
      content: ''
      background: var(--shocking-pink)
      height: 0
      left: -50%
      position: absolute
      top: -50%
      transform: rotate(45deg)
      transition: all 500ms
      width: 0
      z-index: 1

    &:hover:before,
    &:focus:before
      height: 200%
      width: 200%

    &:active:before
      background: red
</style>
