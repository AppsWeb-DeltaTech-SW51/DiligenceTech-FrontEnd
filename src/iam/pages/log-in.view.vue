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
      signingUp: {
        id: "",
        email: "",
        username: "",
        password: ""
      },
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
    },
    createAgent() {
      if (this.signingUp.id.charAt(0) === 'u' && this.signingUp.id.length === 10) {
        // creates (doesnt check if it already exists)
        this.signingUp.image = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
        this.agentsApi.create(this.signingUp);
        this.$router.push(`/${this.signingUp.id}/workspace`);
      }
    }
  }
}
</script>

<template>
  <div class="flex">
    <div class="col-6 h-screen flex align-items-center justify-content-center">
      <div class="p-fluid">
        <h1 class="mb-4">Log-In</h1>
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
    <div class="col-6 h-screen flex align-items-center justify-content-center bg-gray-900 text-white">
      <div class="p-fluid">
        <h1 class="mb-4">Sign-Up</h1>
        <div class="field">
          <label for="signup-code">Code (u + 9 numbers)</label>
          <pv-input-text v-model="signingUp.id" id="signup-code" type="text" />
        </div>
        <div class="field">
          <label for="signup-email">Email</label>
          <pv-input-text v-model="signingUp.email" id="signup-email" type="text" />
        </div>
        <div class="field">
          <label for="signup-username">Username</label>
          <pv-input-text v-model="signingUp.username" id="signup-username" type="text" />
        </div>
        <div class="field">
          <label for="signup-password">Password</label>
          <pv-input-text v-model="signingUp.password" id="signup-password" type="password" />
        </div>

        <pv-button label="Login" class="mt-2" @click="createAgent"></pv-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>