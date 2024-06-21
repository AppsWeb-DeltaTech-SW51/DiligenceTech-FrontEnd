<script>
export default {
  name: "dashboard",
  props: ['insideProject2'],
  data() {
    return {
      // From the outside
      insideProject3: this.insideProject2,
      // Dialog
      settingsDialog: false,
      // Setings
      language_switch: true,
      // Else
      items: [
        { label: "Projects", to: `/${this.$route.params.id}/workspace` },
        { label: "Pending Projects", to: `/${this.$route.params.id}/project_creation` },
      ],
      project_items: [
        { label: "Due Diligence", to: `/${this.$route.params.id}/workspace/${this.$route.params.project_id}/${this.$route.params.user_type}` },
        { label: "Q&A", to: `/${this.$route.params.id}/qa/${this.$route.params.project_id}/${this.$route.params.user_type}` },
      ],
    };
  },
  methods: {
    openSettingsDialog() {
      this.settingsDialog = true;
    }
  },
}
</script>

<template>
  <div
      v-if="!insideProject2"
      style="background-color:#131920; height:auto"
      class="col-2  text-white pt-4 mt-2"
  >
    <router-link v-for="item in items" :key="item.label" :to="item.to"
                 class="block px-4 py-2 rounded hover:bg-blue-700 transition-colors">
      <span class="text-white text">{{ item.label }}</span>
    </router-link>
    <span @click="openSettingsDialog" class="block px-4 py-2 rounded hover:bg-blue-700 transition-colors text-white text" style="cursor: pointer;">Settings</span>
    <router-link :key="Log-Out" to="/login"
                 class="block px-4 py-2 rounded hover:bg-blue-700 transition-colors">
      <span class="text-white text">Log-Out</span>
    </router-link>
  </div>
  <div
      v-else
      style="background-color:#131920;height:auto"
      class="col-2    text-white pt-4 mt-2"
  >
    <router-link v-for="item in project_items" :key="item.label" :to="item.to"
                 class="block px-4 py-2 rounded hover:bg-blue-700 transition-colors">
      <span class="text-white text">{{ item.label }}</span>
    </router-link>
    <span @click="openSettingsDialog" class="block px-4 py-2 rounded hover:bg-blue-700 transition-colors text-white text" style="cursor: pointer;">Settings</span>
    <router-link :key="Log-Out" to="/login"
                 class="block px-4 py-2 rounded hover:bg-blue-700 transition-colors">
      <span class="text-white text">Log-Out</span>
    </router-link>
  </div >
  <pv-dialog

      header="Settings"
      v-model:visible="settingsDialog"
      :breakpoints="{ '960px': '75vw' }"

      :modal="true"
  >
    <div class="field mt-4">
      <label for="lang" class="mr-5">Language (ESP/ENG):</label>
      <pv-input-switch v-model="language_switch"/>
    </div>
    <div class="field">
      <label class="mr-5">Notification by email:</label>
      <pv-button label="Change" severity="info"></pv-button>
    </div>
    <div class="field">
      <label class="mr-5">Change of password:</label>
      <pv-button label="Change" severity="info"></pv-button>
    </div>
    <div class="field">
      <label class="mr-5">Alerts:</label>
      <pv-button label="Change" severity="info"></pv-button>
    </div>
    <div class="field mb-4">
      <label class="mr-5">Contact Support:</label>
      <pv-button label="Change" severity="info"></pv-button>
    </div>

  </pv-dialog>
</template>

<style scoped>

</style>