<script setup lang="ts">
import { ref } from 'vue';
import { fetchy } from '../../utils/fetchy';

const props = defineProps(["dialogVisible", "binId"]);
const emit = defineEmits(["hideDialog"]);

const capacity = ref('')

async function updateBinStatus() {
    try {
        const updated = await fetchy(`/api/bins/${props.binId}`, "POST", {
        body: { _id: props.binId, status: capacity.value},
        });
        closeDialog()
    } catch (_) {
        return;
    }
};

function closeDialog() {
  emit('hideDialog')
  capacity.value = ''
}
</script>

<template> 
    <div class="text-center">
      <v-dialog
        v-model="props.dialogVisible"
        width="auto"
        @click:outside="closeDialog"
      >
        <v-card>
          <v-card-text>
            <h3>Report Bin Capacity</h3>
            <v-radio-group v-model="capacity">
                <v-radio label="Full" value="Full"></v-radio> 
                <v-radio label="Available" value="NotFull"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-btn :variant="'outlined'"  color="secondary" @click="closeDialog">Cancel</v-btn>
            <v-btn :variant="'outlined'" :disabled="!capacity" color="primary" @click="updateBinStatus">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>