<template>
  <div></div>
</template>

<script>
import axios from "axios";
import config from "../services/app.config"
export default {
  name: "Logout",
  mounted() {
    this.logout();
  },
  methods: {
    logout() {
      axios
        .get("http://" + config.OAUTH_ADDR + "/auth/logout", { withCredentials: true })
        .then(() => {
          this.$router.push("/");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#card-file-input {
  height: 25px;
  width: 60%;
}
</style>
