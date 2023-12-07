<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["disposalType"]);
const score = ref(0);
const isIncrementing = ref(false);

async function getScore() {
  try {
    const scoreDoc = await fetchy(`/api/scores/${props.disposalType}`, "GET");
    score.value = scoreDoc.value;
  } catch (_) {
    return;
  }
}

async function incrementScore() {
  try {
    isIncrementing.value = true;
    await fetchy(`/api/scores/${props.disposalType}`, "PATCH");
    await getScore();
  } catch (_) {
    return;
  }
  isIncrementing.value = false;
}

function getDisposalPastTenseVerb() {
  switch (props.disposalType) {
    case "Recycle":
      return "recycled";

    case "Compost":
      return "composted";

    case "Donate":
      return "donated";
  }
  throw new Error("Not a valid value for disposal type!");
}

onBeforeMount(async () => {
  await getScore();
});
</script>

<template>
  <section class="score-card">
    <p class="score">{{ score }}</p>
    <p class="score-description">items {{ getDisposalPastTenseVerb() }} with WasteWise</p>
    <v-btn variant="tonal" @click="incrementScore" :loading="isIncrementing"><span> + </span>Log {{ props.disposalType }}</v-btn>
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

span {
  font-weight: bold;
  font-size: 1.5em;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
</style>
