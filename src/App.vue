<script>

import {AgentsApiService} from "./shared/services/agents-api.service.js";

export default {
  name: "App",
  components: {},
  data() {
    return {
      sidebarVisible: false,
      agents: [],
      errors: [],
      agentsApi: new AgentsApiService(),
    }
  },
  created() {
    this.getAgents();
  },
  methods: {
    // Fetch articles for selected Source
    getAgents() {
      this.agentsApi.getAll()
          .then(response => {
            this.agents = response.data;
            console.log(response.data);
          })
          .catch(e => {
            this.errors.push(e);
          });
    }
  }
}
</script>

<template>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
