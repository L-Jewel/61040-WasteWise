<script setup lang="ts">
import MapComponent from "@/components/Map/MapComponent.vue";
</script>

<template>
  <main>
    <MapComponent />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 15%;
  gap: 2rem;
}
</style>
