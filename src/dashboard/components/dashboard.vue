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
        { label: "Projects", to: `/${this.$route.params.id}/workspace`, icon: 'pi-folder'  },
        { label: "Pending Projects", to: `/${this.$route.params.id}/project_creation`, icon: 'pi-clock' },
      ],
      project_items: [
        { label: "Due Diligence", to: `/${this.$route.params.id}/workspace/${this.$route.params.project_id}/${this.$route.params.user_type}`, icon: 'pi-search' },
        { label: "Q&A", to: `/${this.$route.params.id}/qa/${this.$route.params.project_id}/${this.$route.params.user_type}`, icon: 'pi-comments'},
      ],
    };
  },
  methods: {
    openSettingsDialog() {
      this.settingsDialog = true;
    }
  },
}
</script><template>
  <div class="p-component col-3 text-dark" style="min-height: 100vh; background-color: #2c3e50">
    <div>
      <!-- Header -->
      <div class="flex align-items-center mb-4">
        <img width="70" class="p-image-toolbar" src="../../assets/images/DiligenceTechImage.png">
        <h1 class="header-title">DiligenceTech</h1>
        <i class="pi pi-bars ml-auto header-icon"></i>
      </div>
      <!-- V-for Buttons -->
      <router-link v-if="!insideProject2" v-for="item in items" :key="item.label" :to="item.to"
                   class="nav-item">
        <i :class="`pi ${item.icon} mr-2 nav-icon`"></i>
        <p class="nav-text">{{ item.label }}</p>
      </router-link>
      <router-link v-else v-for="item in project_items" :key="item.label" :to="item.to"
                   class="nav-item">
        <i :class="`pi ${item.icon} mr-2 nav-icon`"></i>
        <p class="nav-text">{{ item.label }}</p>
      </router-link>
      <!-- General Buttons -->
      <div @click="openSettingsDialog" class="nav-item" style="cursor: pointer;">
        <i class="pi pi-cog mr-2 nav-icon"></i>
        <p class="nav-text">Settings</p>
      </div>
      <router-link :key="Log-Out" to="/login" class="nav-item">
        <i class="pi pi-sign-out mr-2 nav-icon"></i>
        <p class="nav-text">Log-Out</p>
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
      <label for="lang" class="dialog-label">Language (ESP/ENG):</label>
      <pv-input-switch v-model="language_switch"/>
    </div>
    <div class="field">
      <label class="dialog-label">Notification by email:</label>
      <pv-button label="Change" severity="info"></pv-button>
    </div>
    <div class="field">
      <label class="dialog-label">Change of password:</label>
      <pv-button label="Change" severity="info"></pv-button>
    </div>
    <div class="field">
      <label class="dialog-label">Alerts:</label>
      <pv-button label="Change" severity="info"></pv-button>
    </div>
    <div class="field mb-4">
      <label class="dialog-label">Contact Support:</label>
      <pv-button label="Change" severity="info"></pv-button>
    </div>
  </pv-dialog>
</template>

<style>
/* General Styles */
body {
  font-family: 'Arial', sans-serif; /* Cambiar a otra fuente como Arial */
}

.p-component {
  background-color: #2c3e50; /* Azul oscuro */
}

.header-title {
  font-size: 2rem; /* Tamaño de fuente más grande */
  color: #ffffff; /* Texto blanco */
  margin-left: 10px;
  font-weight: bold;
}

.header-icon {
  font-size: 1.75rem; /* Tamaño de icono */
  color: #ffffff; /* Texto blanco */
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 20px; /* Aumentar el espacio interior */
  border-radius: 8px;
  color: #ffffff; /* Texto blanco */
  text-decoration: none;
  transition: background-color 0.3s;
  margin-bottom: 10px;
}

.nav-item:hover {
  background-color: #34495e; /* Color de fondo más oscuro al pasar el ratón */
}

.nav-icon {
  font-size: 1.5rem; /* Tamaño de icono */
  color: #ffffff; /* Texto blanco */
}

.nav-text {
  font-size: 1.1rem; /* Tamaño de texto */
  color: #ffffff; /* Texto blanco */
}

.pv-dialog {
  background-color: #ffffff; /* Fondo del diálogo blanco */
  color: #333333; /* Texto más oscuro */
}

.dialog-label {
  margin-right: 10px;
  font-size: 1.1rem; /* Tamaño de fuente */
  font-weight: bold;
}

.field {
  margin-bottom: 15px;
}
</style>
