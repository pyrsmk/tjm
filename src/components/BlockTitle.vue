<script setup lang="ts">
</script>

<template>
  <h3><slot /></h3>
</template>

<style lang="sass" scoped>
  h3
    background: var(--river-bed)
    color: var(--polar)
    display: inline-block
    font-family: 'Comfortaa', cursive
    font-weight: bold
    margin: 0
    padding: 0 calc(var(--small-margin) * 1.5)
</style>
