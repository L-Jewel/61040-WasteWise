<script setup lang="ts">
import * as L from "leaflet"; // made components/leaflet.d.ts file to make this import work
import "leaflet/dist/leaflet.css";

// reference page: https://javascript.plainenglish.io/building-interactive-mapping-applications-with-leaflet-js-and-vues-options-api-6f820b8d6286

import { ref } from "vue";

const loaded = ref(false);
const mapId = "leaflet-map";
const geojsonData = ref(null);
const mapInstance = ref(null);
const layerControlInstance = ref(null);
const mapOptions = {
  center: L.latLng(42.360001, -71.092003), // <-- MIT, for US wide view: L.latLng(37.0902, -95.7129)
  zoom: 17, // US wide view: 4
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

  mapInstance.value = leafletMap;
}

async function fetchData() {
  const url = "https://api.npoint.io/fdbc5b08a7e7eccb6052";

  try {
    const response = await fetch(url);
    const data = await response.json();
    geojsonData.value = data;
  } catch (err) {
    console.log("err", err);
  }
}

async function initFetchMap() {
  console.log("Initializing Map... ");
  await initMap();
  console.log("Map Initialized! Fetching Data... ");
  await fetchData();
  console.log("Done!");
  loaded.value = true;
}

async function refreshPage() {
  window.location.reload();
}

async function onEachFeature(feature: any, layer: any) {
  if (layer) {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
      layer.on("mouseover", () => {
        layer.openPopup();
      });
      layer.on("mouseout", () => {
        layer.closePopup();
      });
    } else {
      console.log("Invalid layer:", feature);
    }
  }
}
</script>

<template>
  <main>
    <div v-if="!loaded">
      <v-btn type="submit" variant="tonal" size="x-large" @click="initFetchMap">Generate Map</v-btn>
    </div>
    <div v-else>
      <v-btn type="submit" variant="tonal" size="x-large" @click="refreshPage">Refresh Page</v-btn>
    </div>
    <div :id="mapId" style="height: 500px; width: 800px"></div>
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
