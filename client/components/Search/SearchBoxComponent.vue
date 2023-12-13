<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";

const searchQuery = ref("");

async function searchMaterials() {
  void router.push({ path: `/search/${searchQuery.value}` });
}
</script>

<template>
  <article>
    <p>Where can I put a</p>
    <form @submit.prevent="searchMaterials">
      <fieldset>
        <v-text-field placeholder="banana peel" hide-details v-model="searchQuery" variant="outlined" />
      </fieldset>
    </form>
    <p>?</p>
    <p id="subtext">Ex. banana peel, coffee ground, plastic 1, plastic 2, pants</p>
  </article>
</template>

<style scoped>
article {
  border: 2px solid black;
  border-radius: 4px;
  padding: 1rem 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

p {
  font-size: 3.5rem;
}

#subtext {
  font-size: 1rem;
  width: 100%;
}

form {
  flex: 1;
}

form > fieldset {
  padding: 0;
  border: 0;
  width: 100%;
}
</style>
