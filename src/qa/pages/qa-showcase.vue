<script>
import {InformationGroupApiService} from "../../due-diligence/services/informationGroup-api.service.js";
import {DocumentsApiService} from "../../due-diligence/services/documents-api.service.js";
import { storage } from "../../firebase.js";
import {QuestionsApiService} from "../services/questions-api.service.js";
import {AnswersApiService} from "../services/answers-api.service.js";

export default {
  name: "qa-showcase",
  props: ['id','user', 'project_id','userTeam','user_type','insideProject'],
  data() {
    return {
      // Props
      user_local: this.user,
      userTeam_local: this.userTeam,
      insideProject_local: this.insideProject,
      // Dialogs
      newQuestionDialog: false,
      newDocumentsDialog: false,
      questionDialog: false,
      // Question Showcase
      question: {
        user: null,
        content: '',
      },
      // Else
      questions: [],
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
      questionsService: null,
      answersService: null,
      // Posts
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
    this.$emit('openProjectDashboard');
    this.informationGroupsService = new InformationGroupApiService();
    this.documentsService = new DocumentsApiService();
    this.questionsService = new QuestionsApiService();
    this.answersService = new AnswersApiService();
    this.questionsService.getByProject(localStorage.getItem('project'))
        .then((response) => {
          this.questions = response.data;
          this.questions.forEach((questionPossible) => {
            questionPossible.answer = [];
            this.answersService.getByQuestionItem(localStorage.getItem('project'), questionPossible.informationGroup_id)
                .then((response2) => {
                  console.log(response2.data);
                  questionPossible.answer = response2.data;
                });
          });
          console.log(this.questions);
        });
    this.informationGroupsService.getByProject(localStorage.getItem('project'))
        .then((response) => {
          this.informationGroups = response.data;
        });
  },
  methods: {
    returnToMyProjects() {
      this.$router.push(`/${this.user_local.id}/workspace`);
    },
    // Information Item Dialog
    openNewInformationItemDialog() {
      this.newQuestionDialog = true;
    },
    createQuestion() {
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
      // Delete content used for next creation
      this.informationItem.identifier = null;
      this.informationItem.parent = null;
      this.informationItem.name = '';
      // Get out of Dialog
      this.newQuestionDialog = false;
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
    openQuestion(data) {
      this.questionDialog = true;
      this.question = data;
    }
  },
};
</script>

<template>
  <div>
    <div class="card">
      <pv-toolbar class="mb-4 border-2">
        <template #start>
          <h3>Project Q&A</h3>
        </template>
        <template #end>
          <h3>{{htmlUserType(this.$props.user_type)}}</h3>
        </template>
      </pv-toolbar>

      <pv-toolbar class="mb-4 bg-gray-900">
        <template #start>
          <pv-dialog
              header="New Information Item"
              v-model:visible="newQuestionDialog"
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
              <pv-button label="Login" @click="createQuestion" icon="pi pi-check" class="p-button-outlined"></pv-button>
            </template>
          </pv-dialog>
          <pv-button
              label="New Question"
              icon="pi pi-plus"
              class="p-button-info mr-2"
              @click="openNewInformationItemDialog"
              :disabled=" !(this.$props.user_type === 'buy_side')"

          />
        </template>
        <template #end>
        </template>
      </pv-toolbar>



      <pv-data-table
          ref="dt"
          :value="questions"
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
            <h5 class="mb-2 md:m-0 p-as-md-center text-x1"></h5>
            <pv-button
                icon="pi pi-chevron-left"
                class="mr-2"
                severity="warning"
                rounded
                @click="returnToMyProjects"
            />
          </div>
        </template>
        <pv-column
            field="question_id"
            header="Id"
            :sortable="true"
            style="min-width: 4rem"
        ></pv-column>
        <pv-column
            field="user_id"
            header="User"
            :sortable="true"
            style="min-width: 4rem"
        ></pv-column>
        <pv-column
            field="content"
            header="Content"
            :sortable="true"
            style="min-width: 10rem"
        ></pv-column>
        <pv-column :exportable="false" style="min-width: 3rem">
          <template #body="slotProps">
            <pv-dialog
                :header="`Question ${question.question_id}`"
                v-model:visible="questionDialog"
                :breakpoints="{ '960px': '75vw' }"
                :style="{ width: '50vw' }"
                :modal="true"
            >
              <div class="field justify-left">
                <pv-panel header="Question">
                  {{question.content}}
                </pv-panel>
              </div>
              <pv-panel header="Answer" v-if="question.answer.length !== 0">
                {{question.answer[0].content}}
              </pv-panel>
              <div v-else class="field">
                <label>Answer</label>
                <pv-textarea :autoResize="true" rows="2" cols="70"></pv-textarea>
              </div>
              <template #footer>
                <pv-button v-if="question.answer.length === 0" label="Send Answer" class="p-button-outlined"></pv-button>
              </template>
            </pv-dialog>
            <pv-button
                icon="pi pi-chevron-right"
                label="Go"
                class="mr-2"
                severity="info"
                rounded
                @click="openQuestion(slotProps.data)"
            />
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </div>
</template>

<style scoped>

</style>