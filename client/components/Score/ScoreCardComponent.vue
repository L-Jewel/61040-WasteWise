<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["scoreName", "typeOfDisposal"]);
const score = ref(0);

async function getScore() {
  try {
    const test = await fetchy(`/api/scores/${props.scoreName}`, "GET");
    console.log(test);
    return test;
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  const scoreDoc = await getScore();
  score.value = scoreDoc.value;
});
</script>

<template>
  <section class="score-card">
    <p class="score">{{ score }}</p>
    <p class="score-description">items {{ props.typeOfDisposal }} with WasteWise</p>
  </section>
</template>

<style scoped>
section {
  background-color: lightgray;
  border-radius: 0.5em;
}

.score-card {
  display: flex;
  align-items: center;
  gap: 1em;
  padding-left: 1.5em;
  padding-right: 1.5em;
}

.score {
  font-size: 6em;
  font-weight: bold;
}

.score-description {
  font-size: 2em;
}
</style>
