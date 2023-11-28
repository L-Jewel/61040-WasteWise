<script setup lang="ts">
import MaterialInfoComponent from "@/components/Material/MaterialInfoComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
    <main>
        <MaterialInfoComponent :materialName="'Plastic4'" />
    </main>
</template>

<style scoped>
</style>