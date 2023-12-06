<script setup lang="ts">
import BinOverlayComponent from "@/components/Bin/BinOverlayComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

// reference page: https://javascript.plainenglish.io/building-interactive-mapping-applications-with-leaflet-js-and-vues-options-api-6f820b8d6286

import * as L from "leaflet"; // made components/leaflet.d.ts file to make this import work
import "leaflet/dist/leaflet.css";

const loaded = ref(false);
const mapId = "leaflet-map";
const binData = ref(null);
const selectedBin = ref("");
const mapInstance = ref(null);
const layerControlInstance = ref(null);
const mapOptions = {
  center: L.latLng(42.360001, -71.092003), // <-- MIT, for US wide view: L.latLng(37.0902, -95.7129)
  zoom: 16, // US wide view: 4
  zoomControl: true,
  zoomAnimation: false,
  maxBounds: L.latLngBounds(L.latLng(18.91619, -171.791110603), L.latLng(71.3577635769, -66.96466)),
  layers: [],
};

async function initMap() {
  const leafletMap = L.map(mapId, mapOptions);
  const tile = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(leafletMap);
  layerControlInstance.value = L.control.layers({ OpenStreetMap: tile }).addTo(leafletMap);
  leafletMap.on("zoomstart", () => {
    console.log("ZOOM STARTED");
  });

  if (binData.value) {
    for (const bin of binData.value as any) {
      const marker = L.marker(bin.location).addTo(leafletMap);
      marker.on("click", () => {
        selectedBin.value = bin.bin;
      });
    }
  }

  mapInstance.value = leafletMap;
}

async function refreshPage() {
  window.location.reload();
}

async function generateMap() {
  console.log("Fetching Bin Locations... ");
  await getBins();
  console.log("Initializing Leaflet Map... ");
  await initMap();
  console.log("Done!");
  loaded.value = true;
}

async function getBins() {
  let bins;
  try {
    bins = await fetchy(`/api/map`, "GET", { query: { longitude: "42.360001", latitude: "-71.092003" } }); // hardcoded location for now
  } catch (_) {
    console.log("failed to fetch bins");
    console.log(_);
    return;
  }
  binData.value = bins;
  console.log(bins);
}
</script>

<template>
  <main>
    <div v-if="!loaded">
      <v-btn type="submit" variant="tonal" size="x-large" @click="generateMap">Generate Map</v-btn>
    </div>
    <div v-else>
      <v-btn type="submit" variant="tonal" size="x-large" @click="refreshPage">Refresh Page</v-btn>
    </div>
    <div class="map-component">
      <div :id="mapId" style="height: 90vh; width: 90%"></div>
      <BinOverlayComponent v-if="loaded" :bin="selectedBin" :key="selectedBin" class="bin-overlay" />
    </div>
  </main>
</template>

<style>
main {
  width: 100%;
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.bin-overlay {
  position: absolute;
  top: 0;
  right: 5%;
  z-index: 1000;
  max-height: 100%;
  width: 25%;
  padding: 0.5rem;
}

.map-component {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
}
</style>
