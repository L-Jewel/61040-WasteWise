<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";
import MaterialCard from "./MaterialCard.vue";

const props = defineProps(["materialList"]);
const materialList = ref<Array<Record<string, string>>>(props.materialList);

function materialCardClicked(card: string) {
  console.log(card)
  void router.push({ path: `Material/${card}` });
}
</script>

<template>
  <section>
    <article v-if="materialList.length>0" v-for="material in materialList" :key="material._id">
      <MaterialCard :material="material" v-on:click="materialCardClicked(material.name)"/>
    </article>
    <article v-else>
      No information found for this item :(
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
