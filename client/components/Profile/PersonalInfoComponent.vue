<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <section>
    <h1>{{ currentUsername }}</h1>
    <p class="nickname">WasteWizard</p>
    <div class="chips">
      <v-chip variant="elevated">MIT</v-chip>
      <v-chip variant="elevated">Cambridge</v-chip>
    </div>
  </section>
</template>

<style scoped>
h1 {
  margin: 0;
  font-size: 2.5em;
}

.nickname {
  font-size: 150%;
  margin-bottom: 1rem;
}

.chips {
  display: flex;
  gap: 0.5em;
}
</style>
