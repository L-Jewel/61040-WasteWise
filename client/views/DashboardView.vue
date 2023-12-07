<script setup lang="ts">
import PersonalInfo from "@/components/Profile/PersonalInfoComponent.vue";
import ScoreCard from "@/components/Score/ScoreCardComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Dashboard</h1>
    <section class="full-width">
      <!-- <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1> -->
      <div v-if="isLoggedIn" class="dashboard-components">
        <PersonalInfo class="half-width" />
        <section class="scores half-width">
          <ScoreCard score-name="Recycle" type-of-disposal="recycled" />
          <ScoreCard score-name="Compost" type-of-disposal="composted" />
        </section>
      </div>
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

.full-width {
  width: 100%;
}

.half-width {
  width: 50%;
}

.dashboard-components {
  display: flex;
  gap: 2em;
}

.scores {
  display: flex;
  flex-direction: column;
  gap: 2em;
}
</style>
