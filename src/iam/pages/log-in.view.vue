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
              this.setLocalId(response.data[0].id);
              this.$router.push(`/workspace`);
            }
          });
    },
    setLocalId(value) {
      localStorage.setItem('id', value);
    },
    createAgent() {
      if (this.signingUp.id.charAt(0) === 'u' && this.signingUp.id.length === 10) {
        // creates (doesn't check if it already exists)
        this.signingUp.image = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
        this.agentsApi.create(this.signingUp);
        this.$router.push(`/${this.signingUp.id}/workspace`);
      }
    }
  }
}
</script>

<template>
  <div style="background-color:#111a1f" class="flex">
    <div style="background-color: #1b232d " class="p-4 col-6 h-screen flex align-items-center justify-content-center">
      <div class="p-fluid">
        <h1 style="font-size:2rem " class="text-white p-component mb-4">Log-In</h1>
        <div class="field">
          <label style="font-size:1rem " class="text-white p-component " for="email">Email</label>
          <pv-input-text  class="text-white " style="background-color: #19232c;border-color:gray; border-radius: 20px" v-model="email" id="email" type="text" />
        </div>
        <div class="field">
          <label style="font-size:1rem " class="text-white p-component " for="password">Password</label>
          <pv-input-text  class="text-white " style="background-color: #19232c; border-radius: 20px; border-color:gray "  v-model="password" id="password" type="password" />
        </div>

        <pv-button label="Login" class="mt-2" @click="confirmAgent"></pv-button>
      </div>
    </div>
    <div class="col-6 h-screen flex align-items-center justify-content-center bg-gray-900 text-white">
      <div class="p-fluid">
        <h1 style="font-size:2rem " class="text-white p-component mb-4">Sign-Up</h1>
        <div class="field">
          <label style="font-size:1rem " class="text-white p-component " for="signup-code">Code (u + 9 numbers)</label>
          <pv-input-text class="text-white " style="background-color: #212121; border-radius: 20px; border-color:gray " v-model="signingUp.id" id="signup-code" type="text" />
        </div>
        <div class="field">
          <label style="font-size:1rem " class="text-white p-component " for="signup-email">Email</label>
          <pv-input-text class="text-white " style="background-color: #212121; border-radius: 20px; border-color:gray " v-model="signingUp.email" id="signup-email" type="text" />
        </div>
        <div class="field">
          <label style="font-size:1rem " class="text-white p-component " for="signup-username">Username</label>
          <pv-input-text class="text-white " style="background-color: #212121; border-radius: 20px; border-color:gray " v-model="signingUp.username" id="signup-username" type="text" />
        </div>
        <div class="field">
          <label style="font-size:1rem " class="text-white p-component " for="signup-password">Password</label>
          <pv-input-text class="text-white " style="background-color: #212121; border-radius: 20px; border-color:gray " v-model="signingUp.password" id="signup-password" type="password" />
        </div>

        <pv-button label="Login" class="mt-2" @click="createAgent"></pv-button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>