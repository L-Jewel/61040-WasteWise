<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["materialName"]);
const loaded = ref(false);
const material = ref<Record<string, string>>();
const IMAGE_WIDTH = "100%";

const materialTypeToIcons: Record<string, string> = {
  Recyclable: "mdi-recycle",
  Compostable: "mdi-compost",
  "Solid Waste": "mdi-trash-can",
  Donatable: "mdi-heart-box-outline",
};
const materialIcon = computed(() => {
  return material.value ? materialTypeToIcons[material.value.type] : "mdi-help";
});

// expects material name for input
async function getMaterial(name: string) {
  let query: Record<string, string> = name !== undefined ? { name } : {};
  let materialResult;

  try {
    materialResult = await fetchy(`/api/materials/${name}`, "GET", { query });
  } catch (_) {
    return;
  }

  material.value = materialResult;
}

async function logDisposal(materialName: string) {
  try {
    await fetchy(`/api/dispose/${materialName}`, "PATCH");
  } catch (_) {
    return;
  }
}

onBeforeMount(async () => {
  await getMaterial(props.materialName);
  loaded.value = true;
});
</script>

<template>
  <!-- Material Info -->
  <section v-if="material && loaded">
    <h1>{{ material.name }}</h1>
    <article>
      <div class="material-info">
        <div class="material-type">
          <v-icon size="small" v-bind:icon="materialIcon" />
          <p>
            <strong>{{ material.type ?? "Unknown" }}</strong>
          </p>
        </div>
        <v-btn variant="text" append-icon="mdi-chevron-right" density="compact">See Disposal Locations</v-btn>
        <p>
          <i>{{ material.description }}</i>
        </p>
        <p v-if="material.ric">
          <strong>RIC: {{ material.ric }}</strong>
        </p>
      </div>
      <div class="material-img"><v-img cover v-bind:width="IMAGE_WIDTH" v-bind:src="material.image" :aspect-ratio="4 / 3" /></div>
    </article>

    <!-- Log Recycle button -->
    <article class="log-recycle-btn" v-if="isLoggedIn && (material.type == 'Recyclable' || material.type == 'Compostable')">
      <v-btn variant="tonal" @click="logDisposal(material.name)">Log Recycle</v-btn>
    </article>
  </section>
  <!-- Material Not Found -->
  <section v-else-if="loaded">
    <p>Material not found</p>
  </section>
  <!-- Loading Data -->
  <section class="loading-data" v-else>
    <v-progress-circular indeterminate />
  </section>
</template>

<style scoped>
h1 {
  font-size: 2em;
  margin: 0;
}

.loading-data {
  display: flex;
  justify-content: center;
}

article {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 1rem;
}
.material-info {
  width: 70%;
}
.material-info > button {
  padding: 0;
}
.material-img {
  width: 30%;
}

.log-recycle-btn {
  margin-top: 1rem;
}

.material-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
}
</style>
