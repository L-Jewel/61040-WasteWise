<script setup lang="ts">
import { ref } from "vue";
import MaterialCard from "./MaterialCard.vue";

const props = defineProps(["materialList"]);
const materialList = ref<Array<Record<string, string>>>(props.materialList);
</script>

<template>
  <section>
    <article v-for="material in materialList" :key="material._id">
      <MaterialCard :material="material" />
    </article>
  </section>
</template>

<style scoped>
section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.75rem;
}
</style>
