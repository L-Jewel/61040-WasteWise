<script setup lang="ts">
import MaterialInfoComponent from "@/components/Material/MaterialInfoComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());


const props = defineProps(['materialName']);

// const material = $route.params.material;    // TODO: fix hard code for now
</script>

<template>
    <main>
        <MaterialInfoComponent :materialName="props.materialName" />
    </main>
</template>

<style scoped>
</style>