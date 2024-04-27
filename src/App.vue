<script>

import {AgentsApiService} from "./shared/services/agents-api.service.js";
import {DueDiligenceProjectsApiService} from "./due-diligence-project/services/due-diligence-projects-api.service.js";
import {PendingProjectsApiService} from "./pending-projects/services/pending-projects-api.service.js";

export default {
  name: "App",
  components: {},
  data() {
    return {
      // Routes
      items: [
        { label: "My Projects", to: "/my-projects" },
      ],
      // Data from Database
      agents: [],
      dueDiligenceProjects: [],
      pendingProjects: [],
      // Services to acquire data from Database (one per data)
      agentsApi: new AgentsApiService(),
      dueDiligenceProjectApi: new DueDiligenceProjectsApiService(),
      pendingProjectsApi: new PendingProjectsApiService(),
      // Errors
      errors: []
    }
  },
  created() {
    // Acquiring data from Database (one per data)
    this.getAgents();
    this.getDueDiligenceProjects();
    this.getPendingProjects();
  },
  methods: {
    //// Acquiring data from Database functions (one per data)
    // Fetch agents
    getAgents() {
      this.agentsApi.getAll()
          .then(response => {
            this.agents = response.data;
            console.log(response.data);
          })
          .catch(e => {
            this.errors.push(e);
          });
    },
    // Fetch Due Diligence Projects
    getDueDiligenceProjects() {
      this.dueDiligenceProjectApi.getAll()
          .then(response => {
            this.dueDiligenceProjects = response.data;
            console.log(response.data);
          })
          .catch(e => {
            this.errors.push(e);
          });
    },
    // Fetch Pending Projects
    getPendingProjects() {
      this.pendingProjectsApi.getAll()
          .then(response => {
            this.pendingProjects = response.data;
            console.log(response.data);
          })
          .catch(e => {
            this.errors.push(e);
          });
    },
  }
}
</script>

<template>
  <pv-toast />
  <header>
    <pv-toolbar class="bg-gray-900">
      <template #start>
        <img width="70" class="p-image-toolbar" src="./assets/images/DiligenceTechImage.png">
        <h3 class="text-white">DiligenceTech</h3>
      </template>
      <template #end>
        <div class="flex-column">
          <router-link
              v-for="item in items"
              :to="item.to"
              custom
              v-slot="{navigate, href}"
              :key="item.label"
          >
            <pv-button
                class="p-button-text text-white"
                :href="href"
                @click="navigate"
            >{{item.label}}</pv-button>
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>
  <RouterView />
</template>

<style scoped>

</style>
