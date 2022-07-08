<script setup lang="ts">
</script>

<template>
  <slot></slot>
</template>

<style lang="sass">
  @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Source+Sans+Pro&display=swap')
  @import url('https://cdn.jsdelivr.net/npm/modern-normalize/modern-normalize.min.css')

  :root
    --shocking-pink: #FF06B7
    --blackcurrant: #3C2C3E
    --river-bed: #4B5D67
    --magic-mint: #BDF2D5
    --polar: #f2fcf7

    --margin: 1em
    --small-margin: 0.2em

    @media screen and (min-width: 30em)
      --margin: 1.2em

    @media screen and (min-width: 50em)
      --margin: 1.4em

    @media screen and (min-width: 80em)
      --margin: 1.6em

  body
    text-rendering: optimizeLegibility
    -moz-osx-font-smoothing: grayscale
    -webkit-font-smoothing: antialiased

    background: var(--polar)
    color: var(--blackcurrant)
    font-family: 'Source Sans Pro', sans-serif
    // Even if many articles advise to add `1rem` to the 2nd parameter, it impacts how the
    // things are calculated, hence modifying the fluid typography progression. According
    // to Smashing Magazine it seems it fixes an accessibility issue but after some tests
    // and reading other articles, it's probably a slope value to target a perfect
    // typography ruleset. Anyway, I prefer to not use it at all.
    font-size: clamp(1.1rem, 2vw, 1.3rem)
    line-height: 1.5
    min-height: 100vh

  input[type="text"],
  input[type="number"],
  textarea,
  select
    border: 1px solid transparent
    border-top: none
    border-bottom: 1px solid #DDD
    border-radius: 3px
    box-shadow: inset 0 1px 2px rgba(0,0,0,.39), 0 -1px 1px #FFF, 0 1px 0 #FFF
    outline: 0
</style>
