<script>
import {DueDiligenceProjectsApiService} from "../due-diligence/services/due-diligence-projects-api.service.js";
import {AgentsApiService} from "../shared/services/agents-api.service.js";
import {PendingProjectsApiService} from "../pending-projects/services/pending-projects-api.service.js";
import dashboard from "../dashboard/components/dashboard.vue";

export default {
  name: "workspace",
  props: ['id'],
  components: {dashboard},
  data() {
    return {
      // Props
      user_local: null,
      userTeam_local: null,
      // Global variables for Components
      selectedProject: null,
      // Routes
      items: [
        { label: "Due Diligence", to: `/${this.$route.params.id}/workspace` },
        { label: "Q&A", to: `/${this.$route.params.id}/qa` },
        { label: "Settings", to: `/${this.$route.params.id}/settings` },
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
    this.getUser();
    console.log(this.$props);
  },
  methods: {
    //// Acquiring data from Database functions (one per data)
    // Create user from known id
    getUser() {
      this.agentsApi.getById(this.$props.id)
          .then(response => {
            this.user_local = response.data;
          })
          .catch(e => {
            this.errors.push(e);
          });
    },
    // Fetch agents
    getAgents() {
      this.agentsApi.getAll()
          .then(response => {
            this.agents = response.data;
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
        <img width="70" class="p-image-toolbar" src="../assets/images/DiligenceTechImage.png">
        <h3 class="text-white">DiligenceTech</h3>
      </template>
      <template #end>
        <h3 class="text-white">Welcome: {{this.$props.id}}</h3>
      </template>
    </pv-toolbar>
  </header>
  <div class="flex h-screen">
    <dashboard></dashboard>
    <RouterView
        class="col-10"
        :user="user_local"
        :userTeam="userTeam"
    />
  </div>

</template>

<style scoped>

</style>