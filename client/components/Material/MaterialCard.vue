<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["material"]);
const materialInfo = ref(props.material);
const IMAGE_WIDTH = "100%";
</script>

<template>
  <article>
    <p>
      <strong>{{ materialInfo.name }}</strong>
    </p>
    <v-btn variant="text" append-icon="mdi-chevron-right" density="compact">See Disposal Locations</v-btn>
    <v-img v-bind:width="IMAGE_WIDTH" v-bind:src="material.image" :aspect-ratio="16 / 9" cover />
  </article>
</template>

<style scoped>
article {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 4px;
  border: 1px solid black;
  padding: 0.5rem;
}

article > button {
  padding: 0;
}
</style>
