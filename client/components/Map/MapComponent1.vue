<script setup lang="ts">
import * as L from "leaflet";
//declare module "leaflet";
import "leaflet/dist/leaflet.css";

import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
const center = ref([37.0902, -95.7129]);

async function setupLeafletMap() {
  const mapDiv = L.map("mapContainer").setView(center.value, 13);
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution:
      'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: "",
  }).addTo(mapDiv);
}

onBeforeMount(async () => {
  console.log("BENCHMARK 1");
  await setupLeafletMap();
  console.log("BENCHMARK 2");
  loaded.value = true;
});
</script>

<template>
  <main>
    <p1>there should be a map below cry</p1>
    <div id="container">
      <div id="mapContainer"></div>
    </div>
    <div v-if="loaded">is loaded</div>
  </main>
</template>

<style>
.map {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
