<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import MaterialCardSection from "../components/Material/MaterialCardSection.vue";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["input"]);
const isLoadingSearch = ref(false);
const searchQuery = ref("");
const searchResults = ref<Array<Record<string, string>>>([]);
const emptyResults = ref(false);

async function searchByMaterial() {
  // Clear out the search results.
  searchResults.value = [];
  // If there's an empty query, don't bother fetching.
  if (searchQuery.value === "") return;
  // Otherwise, attempt to query the backend for materials.
  isLoadingSearch.value = true;
  emptyResults.value = false;

  try {
    searchResults.value = await fetchy(`/api/search/material/${searchQuery.value}`, "GET");
    console.log(searchResults.value);
  } catch {
    return;
  }
  if (searchResults.value.length == 0) {
    emptyResults.value = true;
  }

  isLoadingSearch.value = false;
}

onBeforeMount(async () => {
  if (props.input) {
    searchQuery.value = props.input;
    await searchByMaterial();
  }
});
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
    <article v-if="emptyResults">No information found for this item.</article>
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
