<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["materialName"]);

const loaded = ref(false);
const material = ref<Record<string, string>>()

const materialTypeToIcons: Record<string, string> = {"Recyclable": "recyclableIcon.png", "Compostable": "compostableIcon.png", "Solid Waste": "solidWasteIcon.png", "Donatable": "donatableIcon.png"}
const materialType = material.value ? materialTypeToIcons[material.value.type] : undefined

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
        <!-- <img src={{ materialType }}/> -->
        <button>See Disposal Locations</button>   <!-- TODO: route to disposal locations map -->
        <p> {{ material.description }}</p>
        <!-- <img src={{ material.image }}/> -->

        <!-- Log Recycle button -->
        <section v-if="isLoggedIn">
            <button>Log Recycle</button>    <!-- TODO: add functionality lmao -->
        </section>

        <!-- Similar Items -->
        <section>
            <h3>Similar Items</h3>
            <button>See More</button>   <!-- TODO: route to search page?? -->
            <!-- TODO: <ItemPreviewComponent> -->
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