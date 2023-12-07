<script setup lang="ts">
import ReportBinStatusComponent from "@/components/Map/ReportBinStatusComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["bin"]);
const binInfo = ref();
const acceptedMaterials = ref<Array<Record<string, string>>>([]);
const misdisposedMaterials = ref<Array<Record<string, string>>>([]);
const isVisible = ref(false);
const loaded = ref(false);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const IMAGE_WIDTH = "30%";

const binStatusDialogVisible = ref(false);

const binTypeToString = () => {
  if (!binInfo.value) return;
  const binType = binInfo.value.type;
  if (binType === 0) {
    return "Compost";
  } else if (binType === 1) {
    return "Recycling";
  } else if (binType === 2) {
    return "Trash";
  } else if (binType === 3) {
    return "Donation";
  } else {
    return "Unknown";
  }
};

const redirectToMaterialPage = (materialName: string) => {
  void router.push({ path: `/material/${materialName}` });
};

async function getBinInfo() {
  acceptedMaterials.value = [];
  if (props.bin && props.bin.length) {
    isVisible.value = true;
    loaded.value = false;
    // First get bin info
    const result = await fetchy(`/api/bins/${props.bin}`, "GET");

    if (result) {
      binInfo.value = result;
      // Then get info related to the accepted materials
      for (const acceptedMaterial of result.acceptedMaterials) {
        const matInfo = await fetchy(`/api/materials/${acceptedMaterial}`, "GET");
        if (matInfo) {
          acceptedMaterials.value.push(matInfo);
        }
      }
      // and also to the not accepted materials
      for (const misdisposedMaterial of result.misdisposedMaterials) {
        const matInfo = await fetchy(`/api/materials/${misdisposedMaterial}`, "GET");
        if (matInfo) {
          misdisposedMaterials.value.push(matInfo);
        }
      }
    } else {
      binInfo.value = undefined;
    }
  } else {
    binInfo.value = undefined;
  }
  loaded.value = true;
}

// When the user hits the "X" icon, the overlay closes.
function clearOverlay() {
  isVisible.value = false;
}

// Fetches the bin information on mount.
onBeforeMount(async () => {
  await getBinInfo();
});
</script>

<template>
  <article v-if="isVisible">
    <v-card>
      <div class="bin-title">
        <h2>{{ binTypeToString() }} Bin</h2>
        <v-btn @click="clearOverlay" variant="text" density="compact" icon="mdi-close" />
      </div>
      <v-progress-linear v-if="!loaded" indeterminate />
      <div class="bin-info">
        <p v-if="binInfo && binInfo.status">
          <i>Reported as {{ binInfo.status === "NotFull" ? "not full" : "full" }} at {{ new Date(binInfo.lastStatusUpdate).getHours() }}:{{ new Date(binInfo.lastStatusUpdate).getMinutes() }}</i>
        </p>
        <p v-else><i>Status unknown</i></p>
        <div>
          <h3>Accepts</h3>
          <div class="material-row" v-if="acceptedMaterials.length > 0">
            <v-img
              v-bind:width="IMAGE_WIDTH"
              @click="redirectToMaterialPage(ba.name)"
              class="bin-accepts"
              v-for="ba in acceptedMaterials"
              cover
              :src="ba.image"
              :aspect-ratio="1 / 1"
              v-bind:key="ba._id"
            />
          </div>
          <p v-else><i>Materials accepted at this bin are unknown.</i></p>
        </div>
        <div v-if="misdisposedMaterials.length > 0">
          <h3>Does not accept</h3>
          <div class="material-row">
            <v-img
              v-bind:width="IMAGE_WIDTH"
              @click="redirectToMaterialPage(ba.name)"
              class="bin-no-accepts"
              v-for="ba in misdisposedMaterials"
              cover
              :src="ba.image"
              :aspect-ratio="1 / 1"
              v-bind:key="ba._id"
            />
          </div>
        </div>
        <div v-if="isLoggedIn" class="bin-btn-col">
          <v-btn variant="tonal" block>Log Recycle</v-btn>
          <v-btn variant="tonal" @click="binStatusDialogVisible = true" block>Report Bin Capacity</v-btn>
        </div>
      </div>
    </v-card>
  </article>

  <ReportBinStatusComponent :dialog-visible="binStatusDialogVisible" :bin-id="props.bin" @hide-dialog="binStatusDialogVisible = false" />
</template>

<style scoped>
.bin-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bin-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.v-card {
  padding: 0.5rem;
  overflow-y: auto;
}

.material-row {
  overflow-x: auto;
  display: flex;
  gap: 0.5rem;
}

.bin-accepts {
  border: solid 0.2rem green;
  width: 30%;
  max-width: 30%;
}

.bin-no-accepts {
  border: solid 0.2rem darkred;
  width: 30%;
  max-width: 30%;
}

.bin-btn-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
