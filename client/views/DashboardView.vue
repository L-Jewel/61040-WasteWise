<script setup lang="ts">
import ScoreCard from "@/components/Score/ScoreCardComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Dashboard</h1>
    <section class="full-width">
      <h1 v-if="isLoggedIn" class="user">{{ currentUsername }}</h1>
      <h2 v-if="isLoggedIn">WasteWizard</h2>
      <section v-if="isLoggedIn" class="scores">
        <ScoreCard score-name="Recycle" type-of-disposal="recycled" />
        <ScoreCard score-name="Compost" type-of-disposal="composted" />
      </section>
      <h1 v-else>Please login!</h1>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 15%;
}

h1 {
  text-align: center;
}

h2 {
  text-align: center;
}

.user {
  margin: 0;
}

.full-width {
  width: 100%;
}

.scores {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;
  margin: 1em;
}
</style>
