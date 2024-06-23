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
      projectId: null,
      // Props singular ideas
      username: null,
      image: null,
      // Global variables for Components
      selectedProject: null,
      insideProject: false,
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
    // For changing dashboard
    openProjectDashboard() {
      this.insideProject = true;
    },
    openGeneralDashboard() {
      this.insideProject = false;
    },
    //// Acquiring data from Database functions (one per data)
    // Create user from known id
    getUser() {
      this.agentsApi.getById(this.$props.id)
          .then(response => {
            this.user_local = response.data;
            this.username = response.data.username;
            this.image = response.data.image;
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
  <div class="flex">
    <dashboard
        :insideProject2="this.insideProject"
        :project_id="projectId"
        :user_team="userTeam_local"
    ></dashboard>
    <div class="col-9" style="background-color: #131920">
      <div class="p-4 mb-2 h-4rem p-component text-white flex align-items-center justify-content-end" style="background-color: #1b232d">
        <pv-avatar :image="this.image" style="width: 32px; height: 32px" />
      </div>
      <RouterView
          :user="user_local"
          :userTeam="userTeam_local"
          :insideProject="projectId"
          @openProjectDashboard="openProjectDashboard"
          @openGeneralDashboard="openGeneralDashboard"
      />
    </div>
  </div>
</template>

<style scoped>

</style>