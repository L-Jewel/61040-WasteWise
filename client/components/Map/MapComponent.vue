<script setup lang="ts">
import BinOverlayComponent from "@/components/Bin/BinOverlayComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

// reference page: https://javascript.plainenglish.io/building-interactive-mapping-applications-with-leaflet-js-and-vues-options-api-6f820b8d6286

import * as L from "leaflet"; // made components/leaflet.d.ts file to make this import work
import "leaflet/dist/leaflet.css";
import { onMounted } from "vue";

const props = defineProps(["materialType"]);
const binFilter = ref("");

const loaded = ref(false);
const mapId = "leaflet-map";
const binData = ref(new Map<number, Array<any>>());
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
  // initialize leaflet map
  const leafletMap = L.map(mapId, mapOptions);
  const tile = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(leafletMap);
  layerControlInstance.value = L.control.layers({ OpenStreetMap: tile }).addTo(leafletMap);
  leafletMap.on("zoomstart", () => {
    console.log("ZOOM STARTED");
  });

  // create icons with different colors
  const markerColors = new Map([]);
  for (const [i, color] of ["green", "blue", "black", "orange"].entries()) {
    const colorIcon = new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-" + color + ".png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
    markerColors.set(i, colorIcon);
  }

  // populate map with bins using corresponding colors
  for (const key of binData.value.keys()) {
    const bins = binData.value.get(key);
    for (const bin of bins!) {
      const marker = L.marker(bin.location, { icon: markerColors.get(key) }).addTo(leafletMap);
      marker.on("click", () => {
        selectedBin.value = bin.bin;
      });
    }
  }

  mapInstance.value = leafletMap;
}

onMounted(async () => {
  if (props.materialType) {
    binFilter.value = props.materialType;
  }
  console.log(binFilter.value);
  console.log("Fetching Bin Locations... ");
  await getBins();
  console.log("Initializing Leaflet Map... ");
  await initMap();
  console.log("Done!");
  loaded.value = true;
});

async function getBins() {
  const mapper = ["Compostable", "Recyclable", "Solid Waste", "Donatable"]; // represents order: compost, recycle, trash, donation (material types -> bin types)

  // 4 bin types, hardcoded for now
  for (let i = 0; i < 4; i++) {
    let bins;
    try {
      bins = await fetchy(`/api/map`, "GET", { query: { longitude: "42.360001", latitude: "-71.092003", type: i.toString() } }); // hardcoded location for now
    } catch (_) {
      console.log("failed to fetch bins");
      console.log(_);
      return;
    }
    console.log(bins);
    if (!binFilter.value) {
      binData.value.set(i, bins);
    } else if (binFilter.value == mapper[i]) {
      binData.value.set(i, bins);
    }
  }
}
</script>

<template>
  <main>
    <v-progress-linear v-if="!loaded" indeterminate style="width: 90%" />
    <div class="map-component">
      <div :id="mapId" style="height: 80vh; width: 90%"></div>
      <BinOverlayComponent v-if="loaded" :bin="selectedBin" :key="selectedBin" class="bin-overlay" />
    </div>
  </main>
</template>

<style scoped>
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
