<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["bin"]);
const binInfo = ref<Record<string, string>>();
const isVisible = ref(true);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);

async function getBinInfo() {
  if (props.bin && props.bin.length) {
    console.log(props.bin);
  } else {
    isVisible.value = false;
  }
}

onBeforeMount(async () => {
  await getBinInfo();
});
</script>

<template>
  <article>
    <v-card>
      <div class="bin-title">
        <h2>Recycling Bin</h2>
        <v-btn variant="text" density="compact" icon="mdi-close" />
      </div>
    </v-card>
  </article>
</template>

<style scoped>
.bin-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.v-card {
  padding: 0.5rem;
}
</style>
