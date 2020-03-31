<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center" @click="toHome()" style="cursor: pointer;">
      <h1>MUIC Code Colab</h1>
    </div>
    <v-spacer></v-spacer>
    <v-btn v-if="currentRoute !== 'Login'" @click="logout()">Logout</v-btn>
  </v-app-bar>
</template>

<script>
import axios from "axios";
import config from "../services/app.config";
export default {
  data: function() {
    return {
      currentRoute: "",
      username: ""
    };
  },
  created() {
    this.currentRoute = this.$router.currentRoute.name;
    this.username = this.$cookies.get("username");
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
      this.$cookies.set("filePath", "/temp.txt");
      this.$router.push({
        name: "Editor",
        params: { file: "/temp.txt" }
      });
    },
    toHome() {
      this.$router.push({
        name: "Main"
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
