<script>
import {DueDiligenceProjectsApiService} from "../services/due-diligence-projects-api.service.js";

export default {
  name: "my-projects",
  props: ['id','user','userTeam'],
  data() {
    return {
      // Props
      user_local: this.user,
      userTeam_local: this.userTeam,
      // Else
      projects: [],
      myProjects: [],
      project: {},
      selectedProjects: null,
      projectsService: null,
    };
  },
  created() {
    this.$emit('openGeneralDashboard');
    this.userTeam_local = null;
    this.projectsService = new DueDiligenceProjectsApiService();
    this.projectsService.getAll()
        .then((response) => {
          this.projects = response.data;
          this.projects.forEach(
              project => {
                project.buy_side_agents_id.forEach(
                  buyAgents => {
                    if (buyAgents === localStorage.getItem('id')) {
                      project.user_type = "Buy Side";
                      this.myProjects.push(project);
                    }
                  }
                );
                project.sell_side_agents_id.forEach(
                    sellAgents => {
                      if (sellAgents === localStorage.getItem('id')) {
                        project.user_type = "Sell Side";
                        this.myProjects.push(project);
                      }
                    }
                );
                console.log(project.buy_side_agents_id);
                console.log(project.sell_side_agents_id);
              }
          );
        });
  },
  methods: {
    goingToProject(team, id) {
      localStorage.setItem('project', id);
      this.userTeam_local = team;
      this.$emit('openProjectDashboard');
    },
    viewUserType(team) {
      if (team === "Buy Side")
        return "buy_side";
      else
        return "sell_side";
    },
  },
};
</script>

<template>
  <div>
    <div class="card">
      <pv-toolbar class="mb-4 border-2">
        <template #start>
          <h3>Projects</h3>
        </template>
        <template #end>
        </template>
      </pv-toolbar>
      <pv-toolbar class="mb-4 bg-gray-900">
        <template #start>
          <pv-button
              label=""
              class="p-button-warning mr-2"
              @click=""
              :disabled="true"
          />
        </template>
        <template #end>
        </template>
      </pv-toolbar>



      <pv-data-table
          ref="dt"
          :value="myProjects"
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
            <h5 class="mb-2 md:m-0 p-as-md-center text-x1">My Projects</h5>
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
            field="date_edited"
            header="Date Edited"
            :sortable="true"
            style="min-width: 8rem"
        ></pv-column>
        <pv-column
            field="user_type"
            header="My Team"
            :sortable="true"
            style="min-width: 8rem"
        ></pv-column>
        <pv-column :exportable="false" style="min-width: 3rem">
          <template #body="slotProps">
            <router-link
                :to="`/workspace/${slotProps.data.id}/${viewUserType(slotProps.data.user_type)}`"
            >
              <pv-button
                  icon="pi pi-chevron-right"
                  class="mr-2"
                  severity="success"
                  rounded
                  @click="goingToProject(slotProps.data.user_type, slotProps.data.id)"
              />
            </router-link>

          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>

</style>