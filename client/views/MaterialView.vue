<script setup lang="ts">
import MaterialInfoComponent from "@/components/Material/MaterialInfoComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const material = 'Plastic 4';    // TODO: fix hard code for now
</script>

<template>
    <main>
        <MaterialInfoComponent :materialName="material" />
    </main>
</template>

<style scoped>
</style>