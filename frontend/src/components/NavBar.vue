<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <h1>MUIC Code Colab</h1>
    </div>
    <v-spacer></v-spacer>
    <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
      <span class="mr-2">Latest Release</span>
      <v-icon>mdi-open-in-new</v-icon>
    </v-btn>
    <v-btn @click="logout()" color="secondary">Logout</v-btn>
  </v-app-bar>
</template>

<script>
import axios from "axios";
export default {
  methods: {
    logout() {
      axios
        .get("http://localhost:3000/auth/logout", { withCredentials: true })
        .then(() => {
          this.$router.push("/login");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>