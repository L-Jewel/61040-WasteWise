<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";

const props = defineProps(["material"]);
const materialInfo = ref(props.material);
const IMAGE_WIDTH = "100%";
const redirectToMaterialPage = () => {
  void router.push({ path: `/material/${materialInfo.value.name}` });
};
const redirectToMapPage = () => {
  void router.push({ path: `/map/${materialInfo.value.type}` });
};
</script>

<template>
  <article>
    <RouterLink :to="{ path: `/material/${materialInfo.name}` }">
      <p>
        <strong>{{ materialInfo.name }}</strong>
      </p>
    </RouterLink>
    <v-btn @click="redirectToMapPage" variant="text" append-icon="mdi-chevron-right" density="compact">See Disposal Locations</v-btn>
    <v-img @click="redirectToMaterialPage" v-bind:width="IMAGE_WIDTH" v-bind:src="material.image" :aspect-ratio="16 / 9" cover />
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
  max-height: 220px;
  max-width: 290px;
}

article > button {
  padding: 0;
}

article > a {
  color: black;
  text-decoration: none;
}
</style>
