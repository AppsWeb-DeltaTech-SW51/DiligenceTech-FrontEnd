<script>
import {DueDiligenceProjectsApiService} from "../due-diligence-project/services/due-diligence-projects-api.service.js";

export default {
  name: "my-projects",
  data() {
    return {
      projects: [],
      project: {},
      selectedProjects: null,
      projectsService: null,
    };
  },
  created() {
    this.projectsService = new DueDiligenceProjectsApiService();
    this.projectsService.getAll()
        .then((response) => {
          this.projects = response.data;
          console.log(response.data);
        });
  },
  methods: {
  },
};
</script>

<template>
  <div>
    <div class="card">
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button
              label="New"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              @click=""
          />
          <pv-button
              label="Delete"
              icon="pi pi-trash"
              class="p-button-danger"
              @click=""
              :disabled="true"
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
      >
        <template #header>
          <div class="table-header flex flex-column md:flex-row
md:justify-content-between">
            <h5 class="mb-2 md:m-0 p-as-md-center text-x1">My Projects</h5>
          </div>
        </template>
        <pv-column
            selectionMode="multiple"
            style="width: 3rem"
            :exportable="false"
        ></pv-column>
        <pv-column
            field="id"
            header="Id"
            :sortable="true"
            style="min-width: 12rem"
        ></pv-column>
        <pv-column
            field="name"
            header="Name"
            :sortable="true"
            style="min-width: 16rem"
        ></pv-column>
        <pv-column
            field="date_published"
            header="Date Published"
            :sortable="true"
            style="min-width: 16rem"
        ></pv-column>
        <pv-column
            field="date_edited"
            header="Date Edited"
            :sortable="true"
            style="min-width: 16rem"
        ></pv-column>
        <pv-column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <pv-button
                icon="pi pi-briefcase"
                class="p-button-text p-button-rounded"
                @click=""
            />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>

</style>