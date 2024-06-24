<script>
import {PendingProjectsApiService} from "../services/pending-projects-api.service.js";
import {InvitationsApiService} from "../services/invitations-api.service.js";
import {DueDiligenceProjectsApiService} from "../../due-diligence/services/due-diligence-projects-api.service.js";
import { useToast } from "primevue/usetoast";

export default {
  name: "pending-projects",
  props: ['id','user','userTeam'],
  data() {
    return {
      // Props
      toast: useToast(),
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
      invitationsService: null,
      projectsService: null,
    };
  },
  created() {
    this.$emit('openGeneralDashboard');
    this.userTeam_local = null;
    this.pendingProjectsService = new PendingProjectsApiService();
    this.invitationsService = new InvitationsApiService();
    this.projectsService = new DueDiligenceProjectsApiService();
    // Getting all
    this.pendingProjectsService.getAll()
        .then((response) => {
          response.data.forEach(
              pending_project => {
                this.invitationsService.getByProject(pending_project.id)
                    .then((response2) => {
                      response2.data.forEach(invitation => {
                        if (invitation.user_id === localStorage.getItem('id')) {
                          console.log('1');
                          this.projects.push(pending_project);
                          this.projects[this.projects.length - 1].team = this.team_html(invitation.team);
                          this.projects[this.projects.length - 1].teamConfirm = (invitation.confirmation);
                          this.projects[this.projects.length - 1].sell_confirms = [];
                          this.projects[this.projects.length - 1].sell_ids = [];
                          this.projects[this.projects.length - 1].buy_confirms = [];
                          this.projects[this.projects.length - 1].buy_ids = [];
                          response2.data.forEach(posibleParticipant => {
                            if(this.projects[this.projects.length - 1].id === posibleParticipant.project_id && posibleParticipant.team === 'sell_side') {
                              this.projects[this.projects.length - 1].sell_confirms.push(posibleParticipant.confirmation);
                              this.projects[this.projects.length - 1].sell_ids.push(posibleParticipant.user_id);
                            }
                            if(this.projects[this.projects.length - 1].id === posibleParticipant.project_id && posibleParticipant.team === 'buy_side') {
                              this.projects[this.projects.length - 1].buy_confirms.push(posibleParticipant.confirmation);
                              this.projects[this.projects.length - 1].buy_ids.push(posibleParticipant.user_id);
                            }
                          });
                        }
                      });

                    });
          });
          console.log(response.data);

        });
  },
  methods: {
    newProject() {
      let date = new Date();
      // POST pending project
      this.pendingProjectsService.create({
        id: this.code,
        name: this.project_name,
        date_published: `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`,
      });
      this.projects.push({
        id: this.code,
        name: this.project_name,
        date_published: `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`,
        buy_confirms: [!this.chosenTeam],
        sell_confirms: [this.chosenTeam],
        team: this.chosenTeam ? 'sell_side' : 'buy_side',
        teamConfirm: true,
      });
      console.log(this.projects)
      // POST invitations
      //// self invitation
      this.invitationsService.create({
        user_id: localStorage.getItem('id'),
        project_id: this.code.toLowerCase(),
        "team": this.chosenTeam ? 'sell_side' : 'buy_side',
        "confirmation": true,
      });
      /*
      this.projects[this.projects.length - 1].sell_confirms = [];
      this.projects[this.projects.length - 1].sell_confirms.push({
        user_id: this.$props.user,
        project_id: this.project_name,
        "team": this.chosenTeam ? 'buy_side' : 'sell_side',
        "confirmation": true,
      });
      */
      //// friend invitation
      this.invitationsService.create({
        user_id: this.opponent,
        project_id: this.code.toLowerCase(),
        "team": this.chosenTeam ? 'buy_side' : 'sell_side',
        "confirmation": false,
      });
      this.newProjectDialog = false;
    },
    confirmSeverity(count, max) {
      if (count < max / 3)
        return 'danger'
      if (count < max / 6)
        return 'warning'
      return 'success'
    },
    viewUserType(team) {
      if (team === "Buy Side")
        return "buy_side";
      else
        return "sell_side";
    },
    team_html(team) {
      if (team === "buy_side")
        return "Buy Side";
      else
        return "Sell Side";
    },
    openNewProjectDialog() {
      this.newProjectDialog = true;
    },
    // Confirming
    changeConfirm(value, slotProps_project, team, data, slotProps_user = localStorage.getItem('id')) {
      // update on view
      this.projects.forEach(project => {
        if (project.id === slotProps_project) {
          let bool = true;
          if (team === 'Buy Side') {
            project.buy_confirms.forEach((confirmation, index) => {
              if (bool && confirmation === value) {
                project.buy_confirms[index] = !value;
                bool = false;
              }
            });
          }
          else {
            project.sell_confirms.forEach((confirmation, index) => {
              if (bool && confirmation === value) {
                project.sell_confirms[index] = !value;
                bool = false;
              }
            });
          }
        }
      });
      // update on back-end
      console.log(value, slotProps_project, slotProps_user, team, data);
      this.invitationsService.getInvitation(slotProps_project, slotProps_user)
          .then((response) => {
            response.data.forEach(invitation => {
              this.invitationsService.update(invitation.id, {
                user_id: slotProps_user,
                project_id: slotProps_project,
                team: team === 'Buy Side' ? 'buy_side' : 'sell_side',
                confirmation: !value
              });
              console.log('it did it');
            });
          });
      // check must be removed
      let date = new Date();
      if (data.sell_confirms.length === data.sell_confirms.filter(Boolean).length && data.buy_confirms.length === data.buy_confirms.filter(Boolean).length) {
        // create usable project
        this.projectsService.create({
          id: slotProps_project,
          name: data.name,
          date_published: `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`,
          date_edited: `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`,
          sell_side_agents_id: data.sell_ids,
          buy_side_agents_id: data.buy_ids,
        });
        // delete previous project
        // from db (project)
        this.pendingProjectsService.delete(slotProps_project);
        // from db (invitations)
        this.invitationsService.getByProject(slotProps_project)
            .then((response) => {
              console.log('the amount is: ' + response.data.length);
              response.data.forEach(invitation => {
                this.invitationsService.delete(invitation.id);
              });
            });
        // delete from view
        this.projects.forEach((project, index) => {
          if (project.id === slotProps_project) {
            this.projects.splice(index,1);
          }
        });
        // toast
        this.toast.add({ severity: 'success', summary: 'Project has been created', detail: 'Confirmed project can now be observed at My Projects', life: 3000 });
      }
      // go back (if its removed then maybe you shouldn't
      return !value;
    }
  },
};
</script>

<template>
  <pv-toast />
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
          <label for="team" class="mr-4">Buy-Side</label>
          <pv-input-switch v-model="chosenTeam"></pv-input-switch>
          <label for="team" class="ml-4">Sell-Side</label>
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
            field="team"
            header="My Team"
            :sortable="true"
            style="min-width: 8rem"
        ></pv-column>
        <pv-column header="Confirm" :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <pv-button
                icon="pi pi-chevron-right"
                :label="slotProps.data.teamConfirm ? 'Deconfirm' : 'Confirm' "
                class="mr-2 p-button-outlined"
                :severity="slotProps.data.teamConfirm ? 'danger' : 'success'"
                rounded
                @click="slotProps.data.teamConfirm = changeConfirm(slotProps.data.teamConfirm, slotProps.data.id, slotProps.data.team, slotProps.data)"
            />
          </template>
        </pv-column>
        <pv-column
            header="Sell-Side Confirms"
            style="min-width: 4rem"
        >
          <template #body="slotProps">
            <pv-button :severity="confirmSeverity(slotProps.data.sell_confirms.filter(Boolean).length, slotProps.data.sell_confirms.length)" :label="`${slotProps.data.sell_confirms.filter(Boolean).length}/${slotProps.data.sell_confirms.length}`"></pv-button>
          </template>
        </pv-column>
        <pv-column
            header="Buy-Side Confirms"
            style="min-width: 4rem"
        >
          <template #body="slotProps">
            <pv-button :severity="confirmSeverity(slotProps.data.buy_confirms.filter(Boolean).length,slotProps.data.buy_confirms.length)" :label="`${slotProps.data.buy_confirms.filter(Boolean).length}/${slotProps.data.buy_confirms.length}`"></pv-button>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>

</style>