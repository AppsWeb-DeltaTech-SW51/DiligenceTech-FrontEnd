<script>
import {InformationGroupApiService} from "../services/informationGroup-api.service.js";

export default {
  name: "project-showcase",
  props: ['id','user', 'project_id','userTeam','user_type'],
  data() {
    return {
      // Props
      user_local: this.user,
      userTeam_local: this.userTeam,
      // Else
      informationGroups: [],
      informationGroups_parent: null,
      informationGroups_grandparents: [],
      informationGroups_focused: [],
      selectedProjects: null,
      informationGroupsService: null,
    };
  },
  created() {
    this.informationGroupsService = new InformationGroupApiService();
    this.informationGroupsService.getByProject(this.$props.project_id)
        .then((response) => {
          this.informationGroups = response.data;
          this.informationGroups.forEach(
              informationGroup => {
                if (informationGroup.parent === this.informationGroups_parent) {
                  // include in showcase
                  this.informationGroups_focused.push(informationGroup);
                  // see if it has children
                  this.informationGroupsService.getChildren(this.$props.project_id, informationGroup.identifier)
                      .then((response) => {
                        informationGroup.hasChildren = response.data;
                      });
                }
              }
          );
        });
  },
  methods: {
    changeInformationGroup(group_id) {
      // delete focus' informationGroups
      while (this.informationGroups_focused.length != 0) {
        this.informationGroups_focused.pop();
      }
      // change value of father
      this.informationGroups_grandparents.push(this.informationGroups_parent);
      this.informationGroups_parent = group_id;
      // add new focus' informationGroups
      this.informationGroupsService.getByProject(this.$props.project_id)
          .then((response) => {
            this.informationGroups.forEach(
                informationGroup => {
                  if (informationGroup.parent === this.informationGroups_parent) {
                    // include in showcase
                    this.informationGroups_focused.push(informationGroup);
                    // see if it has children
                    this.informationGroupsService.getChildren(this.$props.project_id, informationGroup.identifier)
                        .then((response) => {
                          informationGroup.hasChildren = response.data;
                        });
                  }
                }
            );
          });
    },
    revertInformationGroup() {
      // delete focus' informationGroups
      while (this.informationGroups_focused.length != 0) {
        this.informationGroups_focused.pop();
      }
      // change value of father
      if (this.informationGroups_grandparents.length != 0) {
        this.informationGroups_parent = this.informationGroups_grandparents[this.informationGroups_grandparents.length - 1];
        this.informationGroups_grandparents.pop();
      }
      else {
        this.$router.push(`/${this.user_local.id}/workspace`);
      }
      // add new focus' informationGroups
      this.informationGroupsService.getByProject(this.$props.project_id)
          .then((response) => {
            this.informationGroups.forEach(
                informationGroup => {
                  if (informationGroup.parent === this.informationGroups_parent) {
                    // include in showcase
                    this.informationGroups_focused.push(informationGroup);
                    // see if it has children
                    this.informationGroupsService.getChildren(this.$props.project_id, informationGroup.identifier)
                        .then((response) => {
                          informationGroup.hasChildren = response.data;
                        });
                  }
                }
            );
          });
    },
    htmlUserType(team) {
      if (team === "buy_side")
        return "Buy Side";
      else
        return "Sell Side";
    },
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
          :value="informationGroups_focused"
          v-model:selection="selectedProjects"
          dataKey="identifier"
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
            <h5 class="mb-2 md:m-0 p-as-md-center text-x1">{{this.$props.project_id}}</h5>
            <h5 class="mb-2 md:m-0 p-as-md-center text-x1">{{ htmlUserType(this.$props.user_type) }}</h5>
            <pv-button
                icon="pi pi-chevron-left"
                class="mr-2"
                severity="warning"
                rounded
                @click="revertInformationGroup"
            />
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
            style="min-width: 14rem"
        ></pv-column>
        <pv-column
            field="date_edited"
            header="Date Edited"
            :sortable="true"
            style="min-width: 14rem"
        ></pv-column>
        <pv-column
            field="user_type"
            header="Team"
            :sortable="true"
            style="min-width: 8rem"
        ></pv-column>
        <pv-column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <pv-button
                icon="pi pi-chevron-right"
                class="mr-2"

                severity="success"
                rounded
                @click="changeInformationGroup(slotProps.data.identifier)"
            />
            <pv-button
                icon="pi pi-chevron-down"
                class="mr-2"

                severity="info"
                rounded
                @click="changeInformationGroup(slotProps.data.identifier)"
            />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>

</style>