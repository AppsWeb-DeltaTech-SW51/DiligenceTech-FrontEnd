<script>
import {InformationGroupApiService} from "../services/informationGroup-api.service.js";
import {DocumentsApiService} from "../services/documents-api.service.js";

export default {
  name: "project-showcase",
  props: ['id','user', 'project_id','userTeam','user_type'],
  data() {
    return {
      // Props
      user_local: this.user,
      userTeam_local: this.userTeam,
      // Dialogs
      newInformationItemDialog: false,
      newDocumentsDialog: false,
      // Else
      informationGroups: [],
      informationGroups_parent: null,
      informationGroups_grandparents: [],
      informationGroups_focused: [],
      informationGroups_id: [],
      selectedProjects: null,
      expandedRows: null,
      // Services
      informationGroupsService: null,
      documentsService: null,
      // Posts
      newDocuments: {
        project_id: this.$props.project_id,
        informationGroup_id: null
      },
      informationItem: {
        project_id: this.$props.project_id,
        identifier: '',
        name: '',
        parent: '',
        buy_status: 'None',
        sell_status: 'None'
      },
      next_number: 1,
    };
  },
  created() {
    this.informationGroupsService = new InformationGroupApiService();
    this.documentsService = new DocumentsApiService();
    this.informationGroupsService.getByProject(this.$props.project_id)
        .then((response) => {
          this.informationGroups = response.data;
          this.informationGroups.forEach(
              informationGroup => {
                if (informationGroup.parent === this.informationGroups_parent) {
                  // include in showcase
                  this.informationGroups_focused.push(informationGroup);
                  this.informationGroups_id.push(informationGroup.identifier);
                  // include its documents
                  this.documentsService.getByInformationItem(this.$props.project_id, informationGroup.identifier)
                      .then((response) => {
                        informationGroup.children = response.data;
                      });
                  // see if it has children
                  this.informationGroupsService.getChildren(this.$props.project_id, informationGroup.identifier)
                      .then((response) => {
                        if(response.data.length === 0) {
                          informationGroup.has_children = false;
                        }
                        else {
                          informationGroup.has_children = true;
                        }
                      });
                }
              }
          );
        });
    this.next_number = this.getNextNumber(1);
  },
  methods: {
    changeInformationGroup(group_id) {
      // delete focus' informationGroups
      while (this.informationGroups_focused.length != 0) {
        this.informationGroups_focused.pop();
        this.informationGroups_id.pop();
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
                    this.informationGroups_id.push(informationGroup.identifier);
                    // include documents
                    this.documentsService.getByInformationItem(this.$props.project_id, informationGroup.identifier)
                        .then((response) => {
                          informationGroup.children = response.data;
                        });
                    // see if it has children
                    this.informationGroupsService.getChildren(this.$props.project_id, informationGroup.identifier)
                        .then((response) => {
                          if(response.data.length === 0) {
                            informationGroup.has_children = false;
                          }
                          else {
                            informationGroup.has_children = true;
                          }
                        });
                  }
                }
            );
          });
      this.next_number = this.getNextNumber(1);
    },
    revertInformationGroup() {
      // delete focus' informationGroups
      while (this.informationGroups_focused.length != 0) {
        this.informationGroups_focused.pop();
        this.informationGroups_id.pop();
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
                    this.informationGroups_id.push(informationGroup.identifier);
                    // show documents
                    this.documentsService.getByInformationItem(this.$props.project_id, informationGroup.identifier)
                        .then((response) => {
                          informationGroup.children = response.data;
                        });
                    // see if it has children
                    this.informationGroupsService.getChildren(this.$props.project_id, informationGroup.identifier)
                        .then((response) => {
                          if(response.data.length === 0) {
                            informationGroup.has_children = false;
                          }
                          else {
                            informationGroup.has_children = true;
                          }
                        });
                  }
                }
            );
          });
      this.next_number = this.getNextNumber(1);
    },
    // Documents Dialog
    openNewDocumentsDialog() {
      this.newDocumentsDialog = true;
    },
    addDocuments() {
      // (1) Add to Firebase

      // (2) Add reference to JSON

      // (3) Close Dialog

    },
    // Information Item Dialog
    openNewInformationItemDialog() {
      this.newInformationItemDialog = true;
    },
    getNextNumber(number) {
      this.informationGroupsService.getByProject(this.$props.project_id)
          .then((response) => {
            let canLeave = false;
            while (!canLeave) {
              canLeave = true;
              response.data.forEach(
                  informationGroup => {
                    // currently only works if there's only one parent (for now, always works)
                    if (informationGroup.parent === this.informationGroups_parent && informationGroup.identifier === number.toString()) {
                      number += 1;
                      canLeave = false;
                    }
                  }
              );
            }
            return number;
          });
      return number;
    },
    createInformationItem() {
      // transform into possible information group
      //// identifier = parent.id (except if area) + next_not_taken_number (done before)
      ////// next_number
      let next_number = 1;
      let canLeave = false;
      while (!canLeave) {
        canLeave = true;
        this.informationGroups_focused.forEach(
            (informationGroup) => {
              if (parseInt(informationGroup.identifier) == next_number) {
                next_number += 1;
                canLeave = false;
              }
            });
      }
      ////// now with parent.id
      this.informationItem.identifier = (this.informationGroups_grandparents.length <= 1 ? '' : this.informationGroups_parent + '.') + next_number.toString();
      //// get parent
      this.informationItem.parent = this.informationGroups_parent;
      // POST in db
      this.informationGroupsService.create(this.informationItem);
      // Change visualization again
      this.changeInformationGroup(this.informationGroups_parent);
      // Delete content used for next creation
      this.informationItem.identifier = null;
      this.informationItem.parent = null;
      this.informationItem.name = '';
      // Get out of Dialog
      this.newInformationItemDialog = false;
      // Refresh (for now)
      this.$router;
    },
    htmlUserType(team) {
      if (team === "buy_side")
        return "Buy Side";
      else
        return "Sell Side";
    },
    getArea(identifier) {
      if (identifier === 'Financiero') {
        return true;
      }
      if (identifier === 'Tributario') {
        return true;
      }
      if (identifier === 'Laboral') {
        return true;
      }
      if (identifier === 'Legal') {
        return true;
      }
      return false;
    },
    expandedDesired(desiredRow) {
      this.expandedRows.push(desiredRow);
      this.state.expandedRows
    },
    getStatusSeverity(status) {
      switch (status) {
        case 'Done':
          return 'success';

        case 'In Progress':
          return 'warning';

        case 'None':
          return 'danger';

        default:
          return null;
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="card">
      <pv-toolbar class="mb-4 border-2">
        <template #start>
          <h3>Project</h3>
        </template>
        <template #end>
          <h3>{{htmlUserType(this.$props.user_type)}}</h3>
        </template>
      </pv-toolbar>
      <pv-toolbar class="mb-4 bg-gray-900">
        <template #start>
          <pv-dialog
              header="New Information Item"
              v-model:visible="newInformationItemDialog"
              :breakpoints="{ '960px': '75vw' }"
              :style="{ width: '30vw' }"
              :modal="true"
          >
            <div class="field">
              <label for="parent" class="block">Create inside:</label>
              <pv-input-text id="parent" :placeholder="this.informationGroups_parent === null ? 'None' : this.informationGroups_parent" type="text" :disabled="true"/>
            </div>
            <div class="field">
              <label for="item_desc" class="block">Item Description</label>
              <pv-textarea id="item_desc" v-model="this.informationItem.name" placeholder="Escribir documentos deseados" :autoResize="true" rows="5" cols="36" />
            </div>
            <template #footer>
              <pv-button label="Login" @click="createInformationItem" icon="pi pi-check" class="p-button-outlined"></pv-button>
            </template>
          </pv-dialog>
          <pv-button
              v-if="this.$props.user_type === 'buy_side'"
              label="New Information Item"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              @click="openNewInformationItemDialog"
          />
          <pv-button
              v-else
              label="Add Document"
              icon="pi pi-plus"
              class="p-button-info mr-2"
              @click="openNewDocumentsDialog"
          />
          <pv-dialog
              header="Add Documents"
              v-model:visible="newDocumentsDialog"
              :breakpoints="{ '960px': '75vw' }"
              :style="{ width: '60vw' }"
              :modal="true"
          >
            <div class="field">
              <label for="owner" class="block">Inside:</label>
              <pv-dropdown id="owner" v-model="newDocuments.informationGroup_id" :options="informationGroups_id"></pv-dropdown>
            </div>
            <div class="field">
              <pv-file-upload accept=".csv,.xls,.xlsx,.pdf"></pv-file-upload>
            </div>
            <template #footer>
              <pv-button label="Login" @click="" icon="pi pi-check" class="p-button-outlined"></pv-button>
            </template>
          </pv-dialog>
        </template>
        <template #end>
        </template>
      </pv-toolbar>



      <pv-data-table
          ref="dt"
          :value="informationGroups_focused"
          v-model:selection="selectedProjects"
          v-model:expandedRows="expandedRows"
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
            field="identifier"
            header="Id"
            v-if="this.informationGroups_grandparents.length === 1"
            :sortable="true"
            style="min-width: 4rem"
        ></pv-column>
        <pv-column
            field="name"
            header="Name"
            :sortable="true"
            style="min-width: 10rem"
        ></pv-column>
        <pv-column
            field="sell_status"
            header="Sell-Side Status"
            :sortable="true"
            style="min-width: 12rem"
        >
          <template #body="{data}">
            <pv-tag :severity="getStatusSeverity(data.sell_status)">{{data.sell_status != null ? data.sell_status : 'AREA'}}</pv-tag>
          </template>
        </pv-column>
        <pv-column
            field="buy_status"
            header="Buy-Side Status"
            :sortable="true"
            style="min-width: 12rem"
        >
          <template #body="{data}">
            <pv-tag :severity="getStatusSeverity(data.buy_status)">{{data.buy_status != null ? data.buy_status : 'AREA'}}</pv-tag>
          </template>
        </pv-column>
        <pv-column
            v-if="informationGroups_grandparents.length === 1"
            :expander="true"

            style="width: 3rem"
        ></pv-column>
        <pv-column v-else :exportable="false" style="min-width: 3rem">
          <template #body="slotProps">
            <pv-button
                icon="pi pi-chevron-right"
                label="Go"
                v-if="slotProps.data.has_children"
                class="mr-2"
                severity="success"
                rounded
                @click="changeInformationGroup(slotProps.data.identifier)"
            />
          </template>
        </pv-column>
        <template #expansion="slotProps">
          <div class="p-3">
            <h5>Documents:</h5>
            <pv-data-table
              :value="slotProps.data.children"
            >
              <pv-column
                field="file_name"
                header="Filename"
                :sortable="true"
              ></pv-column>
              <pv-column
                  field="file_name"
                  header="Go To File"
              >
                <template #body="slotProps">
                  <pv-button
                      label="See File"
                      icon="pi pi-chevron-right"
                      class="mr-2"
                      severity="info"
                      rounded
                      @click=""
                  />
                </template>
              </pv-column>
            </pv-data-table>
          </div>
        </template>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>

</style>