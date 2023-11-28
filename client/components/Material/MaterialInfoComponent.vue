<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["materialName"]);

const loaded = ref(false);
const material = ref<Record<string, string>>()

const materialTypeToIcons = {"Recyclable": "recyclableIcon.png", "Compostable": "compostableIcon.png", "Solid Waste": "solidWasteIcon.png", "Donatable": "donatableIcon.png"}

// expects material name for input
async function getMaterial(name: string) {
    let query: Record<string, string> = name !== undefined ? {name} : {};
    let materialResult;
    
    try {
        materialResult = await fetchy("/api/materials/:name", "GET", {query});
    } catch (_) {
        return;
    }

    material.value = materialResult;
}

onBeforeMount(async () => {
    await getMaterial(props.materialName);
    loaded.value = true;
});
</script>

<template>
    <!-- top part of Material view page with name, image, description, and RIC -->
    <section v-if="material && loaded">
        <h2>{{ material.name }}</h2>
        <img src={{ materialTypeToIcons[material.type] }}/>
        <a>See Disposal Locations</a>   <!-- TODO: route to disposal locations map -->
        <p> {{ material.description }}</p>
        <img src={{ material.image }}/> <!-- uhh might need to fix this... -->
    </section>

    <!-- Log Recycle button -->
    <section v-if="isLoggedIn && material && loaded">
        <button>Log Recycle</button>    <!-- TODO: add functionality lmao-->
    </section>

    <!-- Similar Items -->
    <section v-if="material && loaded">
        <h3>Similar Items</h3>
        <a>See More</a> <!-- TODO: route to search page?? -->
        <!-- TODO: <ItemPreviewComponent> -->
    </section>

    <section v-if="!loaded">
        <p>Loading...</p>
    </section>

</template>

<style scoped>
</style>