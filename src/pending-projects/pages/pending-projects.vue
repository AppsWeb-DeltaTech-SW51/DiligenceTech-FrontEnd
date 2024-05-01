<script>
import {PendingProjectsApiService} from "../services/pending-projects-api.service.js";

export default {
  name: "pending-projects",
  props: ['id','user','userTeam'],
  data() {
    return {
      // Props
      user_local: this.user,
      userTeam_local: this.userTeam,
      chosenTeam: false,
      // Dialogs
      newProjectDialog: false,
      opponent: '',
      project_name: '',
      code: '',
      // Else
      projects: [],
      myProjects: [],
      project: {},
      selectedProjects: null,
      pendingProjectsService: null,
    };
  },
  created() {
    this.$emit('openGeneralDashboard');
    this.userTeam_local = null;
    this.pendingProjectsService = new PendingProjectsApiService();
    this.pendingProjectsService.getAll()
        .then((response) => {
          response.data.forEach(
              (pending_project) => {

          });
          this.projects = response.data;
          console.log(response.data);

        });
  },
  methods: {
    goingToProject(team) {
      this.userTeam_local = team;
      this.$emit('openProjectDashboard');
    },
    newProject() {
      let date = new Date();
      // POST pending project
      this.pendingProjectsService.create({
        id: this.code,
        name: this.project_name,
        date_published: `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`,
      });
      // POST invitations

      // Close
      this.newProjectDialog = false;
    },
    viewUserType(team) {
      if (team === "Buy Side")
        return "buy_side";
      else
        return "sell_side";
    },
    openNewProjectDialog() {
      this.newProjectDialog = true;
    },
  },
};
</script>

<template>
  <div>
    <div class="card">
      <pv-toolbar class="mb-4 border-2">
        <template #start>
          <h3>My Pending Projects</h3>
        </template>
        <template #end>
        </template>
      </pv-toolbar>
      <pv-dialog
          header="New Project"
          v-model:visible="newProjectDialog"
          :breakpoints="{ '960px': '75vw' }"
          :style="{ width: '30vw' }"
          :modal="true"
      >
        <div class="field">
          <label for="code" class="block">Code (PJ + 4 numbers):</label>
          <pv-input-text id="code" v-model="code" placeholder="PJ" type="text"/>
        </div>
        <div class="field">
          <label for="name" class="block">Project Name:</label>
          <pv-input-text id="name" v-model="project_name" placeholder="Project" type="text"/>
        </div>
        <div class="field">
          <label for="team" class="mr-4">Buy-Side - Sell-Side:</label>
          <pv-input-switch v-model="chosenTeam"></pv-input-switch>
        </div>
        <div class="field">
          <label for="team" class="block">Opposing Agent Code (U + 9 numbers):</label>
          <pv-input-text v-model="opponent" id="opponent" placeholder="U" type="text"/>
        </div>
        <template #footer>
          <pv-button label="Create Pending Project" class="p-button-outlined" @click="newProject"></pv-button>
        </template>
      </pv-dialog>
      <pv-toolbar class="mb-4 bg-gray-900">
        <template #start>
          <pv-button
              label="New Project"
              class="p-button-warning mr-2"
              @click="openNewProjectDialog"
          />
        </template>
        <template #end>
        </template>
      </pv-toolbar>



      <pv-data-table
          ref="dt"
          :value="projects"
          v-model:selection="selectedProjects"
          dataKey="id"
          :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPage Link PrevPageLink PageLinks
NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5,10,25]"
          current-page-report-template="Showing {first} to {last} of
{totalRecords} projects"
          responsive-layout="scroll"
          show-gridlines
      >
        <template #header>
          <div class="table-header flex flex-column md:flex-row
md:justify-content-between">
            <h5 class="mb-2 md:m-0 p-as-md-center text-x1">My Pending Projects</h5>
          </div>
        </template>
        <pv-column
            field="id"
            header="Id"
            :sortable="true"
            style="min-width: 6rem"
        ></pv-column>
        <pv-column
            field="name"
            header="Name"
            :sortable="true"
            style="min-width: 10rem"
        ></pv-column>
        <pv-column
            field="date_published"
            header="Date Published"
            :sortable="true"
            style="min-width: 8rem"
        ></pv-column>
        <pv-column
            field="user_type"
            header="My Team"
            :sortable="true"
            style="min-width: 8rem"
        ></pv-column>
        <pv-column
            field="user_type"
            header="Sell-Side Confirms"
            :sortable="true"
            style="min-width: 8rem"
        ></pv-column>
        <pv-column
            field="user_type"
            header="Buy-Side Confirms"
            :sortable="true"
            style="min-width: 8rem"
        ></pv-column>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>

</style>