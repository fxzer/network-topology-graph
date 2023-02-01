<script setup lang="ts">
import TopoGraph from '@/views/topoGraph/index.vue'
</script>

<template>
 <div class="app">
  <Suspense>
    <template #default><TopoGraph/></template>
    <template #fallback>Loading...</template>
  </Suspense>
 </div>
</template>

<style scoped>
</style>
