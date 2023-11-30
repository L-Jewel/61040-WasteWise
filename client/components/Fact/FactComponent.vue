<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["materialName"]);

const loaded = ref(false);
const fact = ref<Record<string, string>>();

async function getFact() {
  let factResult;
  try {
    factResult = await fetchy(`/api/fact`, "GET", {});
  } catch (_) {
    return;
  }

  fact.value = factResult;
}

onBeforeMount(async () => {
  await getFact();
  loaded.value = true;
});
</script>

<template>
  <section>
    <!-- Add light bulb image -->
    <img src="/client/assets/images/lightbulb.svg" />
    <div class="fact-content">
      <p class="fact-title">Daily Fact</p>
      <!-- Change to use fact from update -->
      <p class="fact" v-if="fact && loaded">{{ fact.value }}</p>
      <p class="fact" v-else>Loading fact...</p>
      <p class="fact">Glass is 100% recyclable and can be recycled endlessly without loss in quality or purity</p>
    </div>
  </section>
</template>

<style scoped>
section {
  max-width: 60em;
  margin: 0.67em auto 1em;
  display: flex;
  align-items: center;
  background-color: lightgray;
  border-radius: 0.5em;
  gap: 1em;
}

.fact-title {
  font-weight: bold;
  font-size: 2em;
}

img {
  height: 6em;
  padding: 1em;
  margin-left: 1em;
}

.fact {
  font-size: large;
}
</style>
