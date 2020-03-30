<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <h1>MUIC Code Colab</h1>
    </div>
    <v-spacer></v-spacer>
    <v-btn v-if="this.currentRoute === 'Main'" class="mr-6" @click="toEditor()">Go To Editor</v-btn>
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
      this.$router.push("/editor");
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