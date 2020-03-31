<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center" @click="toHome()" style="cursor: pointer;">
      <h1>MUIC Code Colab</h1>
    </div>
    <v-spacer></v-spacer>
    <span v-if="connected === true" style="margin-right:10px">Connected</span>
    <span v-if="sessionId !== ''" style="margin-right:10px"
      >Session Id: {{ sessionId }}</span
    >
    <span v-if="connected === true">User: {{ users }}</span>
    <v-spacer></v-spacer>

    <v-btn v-if="this.currentRoute === 'Main'" class="mr-6" @click="toEditor()"
      >Go To Editor</v-btn
    >
    <v-btn @click="logout()">Logout</v-btn>
  </v-app-bar>
</template>

<script>
import axios from "axios";
import config from "../services/app.config";
export default {
  data: function() {
    return {
      currentRoute: ""
    };
  },
  props: ["sessionId", "connected", "users"],
  created() {
    this.currentRoute = this.$router.currentRoute.name;
  },
  methods: {
    logout() {
      axios
        .get(`http://${config.OAUTH_ADDR}/auth/logout`, {
          withCredentials: true
        })
        .then(() => {
          this.$router.push("/login");
        });
    },
    toEditor() {
      this.$router.push({
        name: "Editor",
        params: { file: "/temp.txt" }
      });
    },
    toHome() {
      this.$router.push({
        name: "Main",
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn {
  background-color: white !important;
  color: #272727;
}
</style>
