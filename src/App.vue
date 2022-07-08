<script setup lang="ts">
  import { RouterView } from 'vue-router'
</script>

<template>
  <Suspense>
    <RouterView />
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>
