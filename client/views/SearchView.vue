<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../utils/fetchy";

const isLoadingSearch = ref(false);
const searchQuery = ref("");

async function searchByMaterial() {
  isLoadingSearch.value = true;
  try {
    const searchResults = await fetchy(`/api/search/material/${searchQuery.value}`, "GET");
    console.log(searchResults);
  } catch {
    return;
  }
  isLoadingSearch.value = false;
}
</script>

<template>
  <main>
    <form @submit.prevent="searchByMaterial">
      <fieldset>
        <v-text-field hide-details v-model="searchQuery" variant="outlined" prepend-inner-icon="mdi-magnify" />
        <v-btn type="submit" variant="tonal" size="x-large" :loading="isLoadingSearch">Search</v-btn>
      </fieldset>
    </form>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 2rem 15%;
}

form > fieldset {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0;
  border: 0;
}
</style>
