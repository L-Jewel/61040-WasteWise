<script setup lang="ts">
import MapComponent from "@/components/Map/MapComponent.vue";

const props = defineProps(["input"]);
</script>

<template>
  <main>
    <MapComponent :materialType="props.input" />
    <section>
      <article>
        <v-icon style="color: green" icon="mdi-map-marker" />
        <strong>Compost Bin</strong>
      </article>
      <article>
        <v-icon style="color: blue" icon="mdi-map-marker" />
        <strong>Recycling Bin</strong>
      </article>
      <article>
        <v-icon style="color: orange" icon="mdi-map-marker" />
        <strong>Donation Bin</strong>
      </article>
      <article>
        <v-icon style="color: black" icon="mdi-map-marker" />
        <strong>Trash Bin</strong>
      </article>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}

section {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1rem;
}

article {
  display: flex;
  gap: 0.5rem;
}
</style>
