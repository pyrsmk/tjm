<script setup lang="ts">
  import { ref } from 'vue'
  import { CompanyType } from '@/stores/profiles'

  defineProps<{ items: object }>()
  const emit = defineEmits(['change'])

  const edit = ref(false)
  const type = ref<string | null>(null)
  const textElement = ref(null)

  function validate(event : Event) {
    const value = (event.target as HTMLInputElement).value
    edit.value = false;
    const interval = setInterval(() => {
      if (textElement.value === null) {
        return
      }
      clearInterval(interval);
      (textElement.value as HTMLInputElement).innerText = value
      emit('change', value)
    }, 10)
  }

  defineExpose({ textElement })
</script>

<template>
  <div class="editable">
    <div ref="textElement" v-if="!edit" @click="edit=true">
      <slot></slot>
    </div>
    <select v-if="edit" id="type" v-model="type" @input="validate" @blur="validate">
      <option v-for="key in Object.keys(CompanyType)" v-bind:key="key" :value="key">
        {{ CompanyType[key as keyof typeof CompanyType] }}
      </option>
    </select>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/>
    </svg>
  </div>
</template>

<style lang="sass" scoped>
  .editable
    align-items: center
    cursor: pointer
    display: flex
    position: relative

    svg
      fill: var(--shocking-pink)
      height: 24px
      right: -24px
      opacity: 0
      position: absolute
      top: 0
      transition: all 250ms
      width: 24px

    &:hover svg,
    &:focus svg
      opacity: 1

    &:active svg
      fill: var(--blackcurrant)
</style>
