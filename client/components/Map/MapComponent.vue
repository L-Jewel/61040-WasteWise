<script setup lang="ts">
import * as L from "leaflet";
//declare module "leaflet";
import "leaflet/dist/leaflet.css";

import { onBeforeMount, ref } from "vue";

const mapElement = ref(null);

const loaded = ref(false);
const mapId = "leaflet-map";
const geojsonData = ref(null);
const mapInstance = ref(null);
const layerControlInstance = ref(null);
const mapOptions = {
  center: L.latLng(37.0902, -95.7129),
  zoom: 4,
  zoomControl: true,
  zoomAnimation: false,
  maxBounds: L.latLngBounds(L.latLng(18.91619, -171.791110603), L.latLng(71.3577635769, -66.96466)),
  layers: [],
};

async function initMap() {
  console.log("BENCHMARK 1 again");
  mapInstance.value = null;
  //const leafletMap = L.map(mapElement.value);
  const leafletMap = L.map(mapId, mapOptions);
  console.log("BENCHMARK 1a");
  const tile = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(leafletMap);
  console.log("BENCHMARK 1b");
  layerControlInstance.value = L.control.layers({ OpenStreetMap: tile }).addTo(leafletMap);
  console.log("BENCHMARK 1c");
  leafletMap.on("zoomstart", () => {
    console.log("ZOOM STARTED");
  });
  console.log("BENCHMARK 1d");

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
  console.log("BENCHMARK 1");
  await initMap();
  console.log("BENCHMARK 2");
  await fetchData();
  console.log("BENCHMARK 3");
  loaded.value = true;
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

onBeforeMount(async () => {
  setTimeout(async () => {
    // your mounted code
    // console.log("BENCHMARK 1");
    // await initMap();
    // console.log("BENCHMARK 2");
    // await fetchData();
    // console.log("BENCHMARK 3");
    //loaded.value = true;
  }, 1);
});
</script>

<template>
  <main>
    <button class="btn-small pure-button" @click="initFetchMap()">Generate Map</button>
    <div :id="mapId" style="height: 850px; width: 500px"></div>
    <div v-if="loaded">
      <p>why no map</p>
      <div :id="mapId" style="height: 850px; width: 500px"></div>
    </div>
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
