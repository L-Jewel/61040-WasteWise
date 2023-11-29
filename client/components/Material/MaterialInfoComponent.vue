<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["materialName"]);

const loaded = ref(false);
const material = ref<Record<string, string>>()

const materialTypeToIcons: Record<string, string> = {
    "Recyclable": "https://drive.google.com/uc?export=view&id=1BDzsYV6XROQxAQhHyCi72uixk8ietOeO", 
    "Compostable": "https://drive.google.com/uc?export=view&id=16l0EGuq7o6kVnQI2Shg2E7uzS9qBcq9r", 
    "Solid Waste": "https://drive.google.com/uc?export=view&id=1GBbZz3UqTaXe7hVaHK3N7XHXT2QPIjSK", 
    "Donatable": "https://drive.google.com/uc?export=view&id=1WtU-kZvBET_hvcW3fNhHpm5A9MvfRou3"
}

const materialType = computed(() => {
  return material.value ? materialTypeToIcons[material.value.type] : undefined
})


// expects material name for input
async function getMaterial(name: string) {
    let query: Record<string, string> = name !== undefined ? {name} : {};
    let materialResult;
    
    try {
        materialResult = await fetchy(`/api/materials/${name}`, "GET", {query});
    } catch (_) {
        return;
    }

    material.value = materialResult;
}

// call this in onBeforeMount to create a new material manually without having to use mongodb
async function createMaterial(name: string, image: string, description: string, ric: string, type: string) {
    try {
        await fetchy("/api/materials", "POST", {
        body: { name: name, image: image, description: description, ric: ric, type:type },
        });
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
    <!-- TODO: image and recylce type icon -->
    <section v-if="material && loaded">
        <h2>{{ material.name }}</h2>
        <img v-bind:src="materialType" alt="type unknown"/>
        <button>See Disposal Locations</button>   <!-- TODO: route to disposal locations map -->
        <p v-if="material.ric"> RIC: {{ material.ric }}</p>
        <p> {{ material.description }}</p>
        <img v-bind:src="material.image" alt="no material image"/>

        <!-- Log Recycle button -->
        <section v-if="isLoggedIn && (material.type == 'Recyclable' || material.type == 'Compostable')">
            <button>Log Recycle</button>    <!-- TODO: add functionality lmao -->
        </section>
    </section>

    <section v-else-if="loaded">
        <p>Material not found</p>
    </section>
   
    <section v-else>
        <p>Loading...</p>
    </section>

</template>

<style scoped>
</style>