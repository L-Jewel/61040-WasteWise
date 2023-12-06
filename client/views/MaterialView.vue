<script setup lang="ts">
import MaterialInfoComponent from "@/components/Material/MaterialInfoComponent.vue";

const props = defineProps(["materialName"]);
</script>

<template>
  <main>
    <MaterialInfoComponent :materialName="props.materialName" />
  </main>
</template>

<style scoped>
main {
  margin: 1.5rem 15%;
}
</style>
