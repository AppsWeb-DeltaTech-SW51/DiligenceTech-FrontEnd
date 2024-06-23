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
        { label: "Projects", to: `/workspace`, icon: 'pi-folder' },
        { label: "Pending Projects", to: `/project_creation`, icon: 'pi-clock' },
      ],
      project_items: [
        { label: "Due Diligence", to: `/workspace/${localStorage.getItem('project')}/${this.$route.params.user_type}`, icon: 'pi-search' },
        { label: "Q&A", to: `/qa/${localStorage.getItem('project')}/${this.$route.params.user_type}`, icon: 'pi-comments'},
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
  <div class="p-component col-3 text-white" style="min-height: 100vh; background-color: #1b232d">
    <div>
      <!-- Header -->
      <div class="flex align-items-center mb-2">
        <img width="70" class="p-image-toolbar" src="../../assets/images/DiligenceTechImage.png">
        <h1 style="font-size: 1.5rem">DiligenceTech</h1>
        <i class="pi pi-bars ml-5" style="font-size: 1.5rem; "></i>
      </div>
      <!-- V-for Buttons -->
      <router-link v-if="!insideProject2" v-for="item in items" :key="item.label" :to="item.to"
                   class="block px-3 py-2 rounded hover:bg-blue-700 transition-colors flex align-items-center"
                   style="text-decoration: none; color: white">
        <i :class="`pi ${item.icon} mr-2`" style="font-size: 1.5rem; "></i>
        <p class="text-white text">{{ item.label }}</p>
      </router-link>
      <router-link v-else v-for="item in project_items" :key="item.label" :to="item.to"
                   class="block px-3 py-2 rounded hover:bg-blue-700 transition-colors flex align-items-center"
                   style="text-decoration: none; color: white">
        <i :class="`pi ${item.icon} mr-2`" style="font-size: 1.5rem"></i>
        <p class="text-white text">{{ item.label }}</p>
      </router-link>
      <!-- General Buttons -->
      <div @click="openSettingsDialog"
                  class="block px-3 py-2 rounded hover:bg-blue-700 transition-colors flex align-items-center" style="cursor: pointer;">
        <i class="pi pi-cog mr-2" style="font-size: 1.5rem"></i>
        <p class="text-white text">Settings</p>
      </div>
      <router-link :key="Log-Out" to="/login"
                   class="block px-3 py-2 rounded hover:bg-blue-700 transition-colors flex align-items-center"
                   style="text-decoration: none; color: white">
        <i class="pi pi-sign-out mr-2" style="font-size: 1.5rem"></i>
        <p class="text-white text">Log-Out</p>
      </router-link>
    </div>
  </div>
  <pv-dialog
      header="Settings"
      v-model:visible="settingsDialog"
      :breakpoints="{ '960px': '75vw' }"
      :style="{ width: '30vw' }"
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

<style>

</style>