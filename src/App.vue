<script>

import {AgentsApiService} from "./shared/services/agents-api.service.js";
import {DueDiligenceProjectsApiService} from "./due-diligence/services/due-diligence-projects-api.service.js";
import {PendingProjectsApiService} from "./pending-projects/services/pending-projects-api.service.js";

export default {
  name: "App",
  data() {
    return {
      // Routes
      items: [
        { label: "My Projects", to: "/my-projects" },
      ],
      // Global Data
      // Data from Database
      agents: [],
      // Services to acquire data from Database (one per data)
      agentsApi: new AgentsApiService(),
      // Errors
      errors: []
    }
  },
  created() {
    // Acquiring data from Database (one per data)
    this.getAgents();
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
  }
}
</script>

<template>
  <pv-toast /> <!-- Don't know if i can remove it -->
  <RouterView
  />
</template>

<style>

</style>
