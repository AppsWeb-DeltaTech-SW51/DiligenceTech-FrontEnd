<script>
import {InformationGroupApiService} from "../services/informationGroup-api.service.js";
import {DocumentsApiService} from "../services/documents-api.service.js";
import { storage } from "../../firebase.js";
import { ref,uploadBytes,getDownloadURL } from "firebase/storage";

export default {
  name: "project-showcase",
  props: ['id','user', 'project_id','userTeam','user_type','insideProject'],
  data() {
    return {
      // Firebase
      myFile: null,
      // Props
      user_local: this.user,
      userTeam_local: this.userTeam,
      insideProject_local: this.insideProject,
      // DIALOGS
      newInformationItemDialog: false,
      newDocumentsDialog: false,
      newAreaDialog: false,
      changeBuyStatusDialog: false,
      changeSellStatusDialog: false,
      // Else
      statusDependency: null,
      statusSwitcher: '',
      informationGroups: [],
      informationGroups_parent: null,
      informationGroups_grandparents: [],
      informationGroups_focused: [],
      informationGroups_id: [],
      selectedProjects: null,
      // pv-table Facades
      expandedRows: null,
      // Services
      informationGroupsService: null,
      documentsService: null,
      // POST Helpers
      newDocuments: {
        project_id: localStorage.getItem('project'),
        informationGroup_id: null
      },
      informationItem: {
        project_id: localStorage.getItem('project'),
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
    this.onInit();
    this.refocusInformationGroups(localStorage.getItem('project'));
    this.next_number = this.getNextNumber(1);
  },
  methods: {
    // onInit
    onInit() {
      this.$emit('openProjectDashboard');
      this.informationGroupsService = new InformationGroupApiService();
      this.documentsService = new DocumentsApiService();
    },
    // General GET
    refocusInformationGroups(projectId) {
      this.informationGroupsService.getByProject(projectId)
          .then((response) => {
            response.data.forEach(
                informationGroup => {
                  if (informationGroup.parent === this.informationGroups_parent) {
                    // include in showcase
                    this.informationGroups_focused.push(informationGroup);
                    this.informationGroups_id.push(informationGroup.identifier);
                    // include documents
                    this.documentsService.getByInformationItem(projectId, informationGroup.identifier)
                        .then((response) => {
                          informationGroup.children = response.data;
                        });
                    // see if it has children
                    this.informationGroupsService.getChildren(projectId, informationGroup.identifier)
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
            )
          });
    },
    deleteFocusInformationGroups() {
      while (this.informationGroups_focused.length !== 0) {
        this.informationGroups_focused.pop();
        this.informationGroups_id.pop();
      }
    },
    askReturnToMyProjects() {
      if (this.informationGroups_grandparents.length === 0 || this.informationGroups_parent === null) {
        this.$router.push(`/workspace`);
        this.insideProject_local = false;
      }
    },
    // Firebase
    upload: function() {
      // Normal Upload
      const storageRef = ref(storage, 'vue/' + this.$refs.myFile.files[0].name);
      uploadBytes(storageRef, this.$refs.myFile.files[0])
          .then((snapshot) => {
            console.log('uploaded');
            getDownloadURL(ref(storageRef))
                .then((url) => {
                  // Create
                  this.documentsService.create({
                    project_id: localStorage.getItem('project'),
                    informationGroup_id: this.newDocuments.informationGroup_id,
                    file_name: this.$refs.myFile.files[0].name,
                    file_url: url,
                  });
                  // Update on InformationGroups in here
                  this.informationGroups.forEach((informationGroup) => {
                    if (informationGroup.identifier === this.newDocuments.informationGroup_id) {
                      informationGroup.children.push({
                        project_id: localStorage.getItem('project'),
                        informationGroup_id: this.newDocuments.informationGroup_id,
                        file_name: this.$refs.myFile.files[0].name,
                        file_url: url,
                      });
                    }
                  });
          });
          })
          .catch((error) => {
            console.log('firebase not working');
          });
      // Close Dialog
      this.$router.push(`/${this.$route.params.id}/workspace/${slotProps.data.id}/${viewUserType(slotProps.data.user_type)}`);
    },
    // Focus of Information Groups
    changeInformationGroup(group_id) {
      // delete focus' informationGroups
      this.deleteFocusInformationGroups();
      // change value of father
      this.informationGroups_grandparents.push(this.informationGroups_parent);
      this.informationGroups_parent = group_id;
      // add new focus' informationGroups
      this.refocusInformationGroups(localStorage.getItem('project'));

    },
    revertInformationGroup() {
      this.askReturnToMyProjects();
      this.deleteFocusInformationGroups();
      // change value of father
      if (this.informationGroups_grandparents.length !== 0) {
        this.informationGroups_parent = this.informationGroups_grandparents[this.informationGroups_grandparents.length - 1];
        this.informationGroups_grandparents.pop();
      }
      // add new focus' informationGroups
      this.refocusInformationGroups(localStorage.getItem('project'));
    },
    // DIALOGS
    openBuyStatusDialog(data) {
      this.statusDependency = data;
      this.changeBuyStatusDialog = true;
      this.statusSwitcher = this.statusDependency.buy_status;
    },
    openSellStatusDialog(data) {
      this.statusDependency = data;
      this.changeSellStatusDialog = true;
      this.statusSwitcher = this.statusDependency.sell_status;
    },
    openNewDocumentsDialog() {
      this.newDocumentsDialog = true;
    },
    openNewAreaDialog() {
      this.newAreaDialog = true;
    },
    openNewInformationItemDialog() {
      this.newInformationItemDialog = true;
    },
    // Next Number
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
    // POST Requests
    areaRequest() {
      return {
        "project_id": localStorage.getItem('project'),
        "identifier": this.informationItem.name,
        "name": this.informationItem.name,
        "parent": null,
        "buy_status": null,
        "sell_status": null
      }
    },
    // POSTs
    createArea() {
      // POST in db (Create)
      this.informationGroupsService.create(this.areaRequest());
      // (Update)
      this.informationGroups_focused.push(this.areaRequest());
      this.informationGroups.push(this.areaRequest());
      // Delete content used for next creation
      this.informationItem.identifier = null;
      this.informationItem.parent = null;
      this.informationItem.name = '';
      // Get out of Dialog
      this.newInformationItemDialog = false;
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
      this.informationGroupsService.create({
        "project_id": this.$props.project_id,
        "identifier": this.informationItem.identifier,
        "name": this.informationItem.name,
        "parent": this.informationItem.parent,
        "buy_status": this.informationItem.buy_status,
        "sell_status": this.informationItem.sell_status
      });
      this.informationGroups_focused.push({
        "project_id": this.$props.project_id,
        "identifier": this.informationItem.identifier,
        "name": this.informationItem.name,
        "parent": this.informationItem.parent,
        "buy_status": this.informationItem.buy_status,
        "sell_status": this.informationItem.sell_status
      });
      this.informationGroups.push({
        "project_id": this.$props.project_id,
        "identifier": this.informationItem.identifier,
        "name": this.informationItem.name,
        "parent": this.informationItem.parent,
        "buy_status": this.informationItem.buy_status,
        "sell_status": this.informationItem.sell_status
      });
      // Delete content used for next creation
      this.informationItem.identifier = null;
      this.informationItem.parent = null;
      this.informationItem.name = '';
      // Get out of Dialog
      this.newInformationItemDialog = false;
    },
    // PUTs
    updateStatus(buy_side) {
      if (buy_side) {
        this.statusDependency.buy_status = this.statusSwitcher;
        this.informationGroupsService.update(this.statusDependency.id, this.statusDependency);
      }
      else {
        this.statusDependency.sell_status = this.statusSwitcher;
        this.informationGroupsService.update(this.statusDependency.id, this.statusDependency);
      }
    },
    // HTML Helpers
    htmlUserType(team) {
      if (team === "buy_side")
        return "Buy Side";
      else
        return "Sell Side";
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
      <pv-toolbar style="background-color:#131920" class="mb-4 border-2">
        <template #start>
          <h3 class="text-white">Project</h3>
        </template>
        <template #end>
          <h3 class="text-white">{{htmlUserType(this.$props.user_type)}}</h3>
        </template>
      </pv-toolbar>
      <pv-toolbar style="background-color:#131920" class="mb-4 ">
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
              <pv-textarea id="item_desc" v-model="this.informationItem.name" placeholder="Write wanted documents" :autoResize="true" rows="5" cols="36" />
            </div>
            <template #footer>
              <pv-button label="Create Item" @click="createInformationItem" icon="pi pi-check" class="p-button-outlined"></pv-button>
            </template>
          </pv-dialog>
          <pv-dialog

              header="New Area"
              v-model:visible="newAreaDialog"
              :breakpoints="{ '960px': '75vw' }"
              :style="{ width: '30vw' }"
              :modal="true"
          >
            <div class="field">
              <label for="parent" class="block">Create inside:</label>
              <pv-input-text id="parent" :placeholder="this.informationGroups_parent === null ? 'None' : this.informationGroups_parent" type="text" :disabled="true"/>
            </div>
            <div class="field">
              <label for="item_desc" class="block">Item Name</label>
              <pv-textarea id="item_desc" v-model="this.informationItem.name" placeholder="Escribir documentos deseados" :autoResize="true" rows="5" cols="36" />
            </div>
            <template #footer>
              <pv-button label="Create Area" @click="createArea" icon="pi pi-check" class="p-button-outlined"></pv-button>
            </template>
          </pv-dialog>
          <pv-button
              style="background-color:#1b232d"
              v-if="this.$props.user_type === 'buy_side' && this.informationGroups_grandparents.length !== 1"
              label="New Area"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              @click="openNewAreaDialog"
          />
          <pv-button
              style="background-color:#1b232d"
              v-else-if="this.$props.user_type === 'buy_side'"
              label="New Information Item"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              @click="openNewInformationItemDialog"
          />
          <pv-button
              style="background-color:#1b232d"
              v-else
              label="Add Document"
              icon="pi pi-plus"
              class="p-button-info mr-2"
              @click="openNewDocumentsDialog"
              :disabled="this.informationGroups_grandparents.length !== 1"
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
              <pv-file-upload ref="myFile" custom-upload @uploader="upload" accept=".csv,.xls,.xlsx,.pdf"></pv-file-upload>
            </div>
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
          :style="{ backgroundColor: '#2B323B', color: 'white', borderColor: 'white' }"
      >
        <template #header>
          <div class="table-header flex flex-column md:flex-row
md:justify-content-between">
            <h5 class="mb-2 md:m-0 p-as-md-center text-x1">{{this.$props.project_id}}</h5>
            <pv-button
                style="background-color:#131920"
                icon="pi pi-chevron-right"
                class="mr-2"
                severity="success"
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
        <pv-column :exportable="false" style="min-width: 3rem">
          <template #body="slotProps">
            <pv-dialog
                header="Change Buy-Side Status"
                v-model:visible="changeBuyStatusDialog"
                :breakpoints="{ '960px': '75vw' }"
                :style="{ width: '30vw' }"
                :modal="true"
            >
              <pv-dropdown id="status" v-model="this.statusSwitcher" :options="['Done', 'In Progress', 'None']"></pv-dropdown>
              <template #footer>
                <pv-button label="Confirm" class="p-button-outlined" @click="updateStatus(true)"></pv-button>
              </template>
            </pv-dialog>
            <pv-dialog
                header="Change Sell-Side Status"
                v-model:visible="changeSellStatusDialog"
                :breakpoints="{ '960px': '75vw' }"
                :style="{ width: '30vw' }"
                :modal="true"
            >
              <pv-dropdown id="status" v-model="this.statusSwitcher" :options="['Done', 'In Progress', 'None']"></pv-dropdown>
              <template #footer>
                <pv-button label="Confirm" class="p-button-outlined" @click="updateStatus(false)"></pv-button>
              </template>
            </pv-dialog>
            <pv-button
                style="background-color:#131920"
                label="Change Status"
                v-if="informationGroups_grandparents.length === 1 && this.$route.params.user_type === 'sell_side'"
                class="mr-2 p-button-outlined"
                severity="info"
                rounded
                @click="openSellStatusDialog(slotProps.data)"
            />
            <pv-button
                style="background-color:#131920"
                icon="pi pi-chevron-right"
                label="Change Status"
                v-else-if="informationGroups_grandparents.length === 1"
                class="mr-2 p-button-outlined; text-white"
                severity="info"
                rounded
                @click="openBuyStatusDialog(slotProps.data)"
            />
          </template>
        </pv-column>
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
                style="background-color:#131920"
                icon="pi pi-chevron-right"
                label="Go"
                v-if="informationGroups_grandparents.length !== 1"
                class="mr-2"
                severity="success"
                rounded
                @click="changeInformationGroup(slotProps.data.identifier)"
            />
          </template>
        </pv-column>
        <template #expansion="slotProps">
          <div
              v-if="slotProps.data.children.length !== 0"
              class="p-3"
          >
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
                  <a
                    :href="slotProps.data.file_url"
                    target="_blank"
                  >
                    <pv-button
                      label="Download File"
                      icon="pi pi-chevron-right"
                      class="mr-2"
                      severity="info"
                      rounded
                      @click=""
                    />
                  </a>
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