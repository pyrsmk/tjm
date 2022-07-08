<script setup lang="ts">
  defineProps<{ modelValue: boolean }>()
  const emit = defineEmits(['update:modelValue'])

  function updateValue(event : Event) {
    emit('update:modelValue', (event.target as HTMLInputElement).checked)
  }
</script>

<template>
  <input type="checkbox" :checked="modelValue" @input="updateValue" />
</template>

<style lang="sass" scoped>
  input
    filter: hue-rotate(86deg) brightness(1.09) saturate(96%) // Make it pink! 🤩
    left: -1.3em
    position: absolute
    width: 1em

    &:hover
      cursor: pointer
</style>
