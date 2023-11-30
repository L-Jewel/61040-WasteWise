<script setup lang="ts">
import { ref } from "vue";
import MaterialCardSection from "../components/Material/MaterialCardSection.vue";
import { fetchy } from "../utils/fetchy";

const isLoadingSearch = ref(false);
const searchQuery = ref("");
const searchResults = ref<Array<Record<string, string>>>([]);

async function searchByMaterial() {
  // Clear out the search results.
  searchResults.value = [];
  // If there's an empty query, don't bother fetching.
  if (searchQuery.value === "") return;
  // Otherwise, attempt to query the backend for materials.
  isLoadingSearch.value = true;
  try {
    searchResults.value = await fetchy(`/api/search/material/${searchQuery.value}`, "GET");
    console.log(searchResults.value);
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
    <MaterialCardSection :materialList="searchResults" :key="searchResults.length" />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 2rem 15%;
  gap: 1rem;
}

form > fieldset {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0;
  border: 0;
}
</style>
