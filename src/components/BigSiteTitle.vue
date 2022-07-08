<script setup lang="ts">
</script>

<template>
  <h1>🤑TJM</h1>
  <div>
    Le calculateur aux p'tits oignons de votre <em>Tarif Journalier Moyen</em>.
  </div>
</template>

<style lang="sass" scoped>
  h1
    color: var(--shocking-pink)
    font-family: 'Comfortaa', cursive
    font-size: 4em
    font-weight: 700
    margin: 0
    white-space: nowrap

    @media (min-width: 800px)
      font-size: 5em

    @media (min-width: 1600px)
      font-size: 6em

  div
    font-size: 0.8em
    margin-top: var(--margin)

    em
      font-style: normal
      border-bottom: 3px solid var(--shocking-pink)
      white-space: nowrap
</style>
