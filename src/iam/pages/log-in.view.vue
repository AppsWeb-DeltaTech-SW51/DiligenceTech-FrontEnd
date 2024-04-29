<script>

import {AgentsApiService} from "../../shared/services/agents-api.service.js";

export default {
  name: "login",
  data() {
    return {
      // Props
      user_local: null,
      // Local
      email: "",
      password: "",
      agentsApi: new AgentsApiService(),
    }
  },
  created() {
  },
  methods: {
    // Proof user's existence
    confirmAgent() {
      this.agentsApi.getByEmailAndPassword(this.email, this.password)
          .then((response) => {
            console.log(response.data)
            console.log(this.email)
            console.log(this.password)
            if (response.data.length != 0) {
              this.user_local = response.data[0];
              this.$router.push(`/${this.user_local.id}/workspace`);
            }
          });
    }
  }
}
</script>

<template>
  <div class="flex">
    <div class="col-6 h-screen flex align-items-center justify-content-center">
      <div class="p-fluid">
        <div class="field">
          <label for="email">Email</label>
          <pv-input-text v-model="email" id="email" type="text" />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <pv-input-text v-model="password" id="password" type="password" />
        </div>

        <pv-button label="Login" class="mt-2" @click="confirmAgent"></pv-button>
      </div>
    </div>
    <div class="col-6 h-screen align-items-center justify-content-center bg-gray-900 text-white">
      <img src="../../assets/images/DiligenceTechImage.png">
      <p class="line-height-3 m-0">
        DiligenceTech
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>