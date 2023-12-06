<script setup lang="ts">
import FactComponent from "@/components/Fact/FactComponent.vue";
import SearchBoxComponent from "@/components/Search/SearchBoxComponent.vue";
</script>

<template>
  <main>
    <SearchBoxComponent />
    <FactComponent />
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
