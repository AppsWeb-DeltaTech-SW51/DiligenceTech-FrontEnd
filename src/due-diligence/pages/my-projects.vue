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
                    if (buyAgents === this.$props.id) {
                      project.user_type = "Buy Side";
                      this.myProjects.push(project);
                    }
                  }
                );
                project.sell_side_agents_id.forEach(
                    sellAgents => {
                      if (sellAgents === this.$props.id) {
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
    goingToProject(team) {
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
          <h3 class="text-3xl font-bold text-white">Projects</h3>
        </template>
      </pv-toolbar>

      <pv-data-table
          ref="dt"
          :value="myProjects"
          v-model:selection="selectedProjects"
          dataKey="id"
          :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rows-per-page-options="[5,10,25]"
          current-page-report-template="Showing {first} to {last} of {totalRecords} projects"
          responsive-layout="scroll"
          show-gridlines
          class="bg-white shadow-md rounded-lg overflow-hidden"
      >
        <template #header>
          <div class="table-header flex justify-between items-center">
            <h5 class="text-lg font-semibold text-black">My Projects</h5>
          </div>
        </template>
        <pv-column
            field="id"
            header="Id"
            :sortable="true"
            style="min-width: 6rem"
            class="text-gray-600"
        ></pv-column>
        <pv-column
            field="name"
            header="Name"
            :sortable="true"
            style="min-width: 10rem"
            class="text-gray-600"
        ></pv-column>
        <pv-column
            field="date_published"
            header="Date Published"
            :sortable="true"
            style="min-width: 8rem"
            class="text-gray-600"
        ></pv-column>
        <pv-column
            field="date_edited"
            header="Date Edited"
            :sortable="true"
            style="min-width: 8rem"
            class="text-gray-600"
        ></pv-column>
        <pv-column
            field="user_type"
            header="My Team"
            :sortable="true"
            style="min-width: 8rem"
            class="text-gray-600"
        ></pv-column>
        <pv-column :exportable="false" style="min-width: 3rem">
          <template #body="slotProps">
            <router-link
                :to="`/${this.$route.params.id}/workspace/${slotProps.data.id}/${viewUserType(slotProps.data.user_type)}`"
            >
              <pv-button
                  icon="pi pi-chevron-right"
                  class="mr-2"
                  severity="success"
                  rounded
                  @click="goingToProject(slotProps.data.user_type)"
              />
            </router-link>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>
<style scoped>
.card {
  background-color: #f0f4f8;
  padding: 20px;
}

.table-header {
  padding: 10px 0;
}

.text-lg {
  font-size: 1.25rem;
}

.text-gray-600 {
  color: #4a5568;
}

.bg-white {
  background-color: #ffffff;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.rounded-lg {
  border-radius: 0.75rem;
}

.overflow-hidden {
  overflow: hidden;
}

/* Styling current page report template */
.p-paginator .p-paginator-current {
  color: white; /* Set text color of current page report to white */
}
</style>
