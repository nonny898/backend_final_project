<template>
  <v-card shaped style="width: 30%;">
    <v-card-title style="justify-content: center;">
      <h1 class="signin">User Login</h1>
    </v-card-title>
    <v-card-subtitle style="display: flex; justify-content: center; padding-top: 24px;">
      <h3>Login with one of these available social accounts...</h3>
    </v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-btn
              depressed
              block
              dark
              :href="googleAuth"
              style="justify-content: end; padding-left: 38%;"
            >
              <i class="fa-2x fab fa-github mr-3"></i>
              Github
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              depressed
              block
              dark
              color="pink"
              :href="googleAuth"
              style="justify-content: end; padding-left: 38%;"
            >
              <i class="fa-2x fab fa-instagram mr-3"></i>
              Instagram
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              depressed
              block
              dark
              color="indigo darken-1"
              :href="googleAuth"
              style="justify-content: end; padding-left: 38%;"
            >
              <i class="fa-2x fab fa-facebook mr-3"></i>
              Facebook
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              depressed
              block
              dark
              color="green lighten-1"
              :href="googleAuth"
              style="justify-content: end; padding-left: 38%;"
            >
              <i class="fa-2x fab fa-google mr-3"></i>
              Google
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              depressed
              block
              dark
              color="blue lighten-1"
              :href="googleAuth"
              style="justify-content: end; padding-left: 38%;"
            >
              <i class="fa-2x fab fa-linkedin mr-3"></i>
              LinkedIn
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import config from "../services/app.config";
export default {
  data: function() {
    return {
      googleAuth: `http://${config.OAUTH_ADDR}/auth/google`
    };
  }
};
</script>

<style scoped>
.v-btn__content {
  margin-left: 37% !important;
}
/* #login-form {
  display: grid;
  grid-template-areas:
    "signin signin signin"
    "facebook google github";
  justify-items: center;
  grid-template-rows: 1fr 3fr;
  width: 50%;
  border-radius: 15px;
  background-color: rgb(235, 235, 235);
  padding: 25px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  align-items: center;
}
.signin {
  grid-area: signin;
  align-self: start;
}
.fa-facebook-square {
  grid-area: facebook;
}
.fa-google-plus-square {
  grid-area: google;
}
.MUIC_logo {
  width: 158px;
  height: 160px;
  grid-area: github;
} */
</style>

/*
cd ..\azure-files\; docker-compose up --build -d; cd ..\backend-oauth\; docker-compose up --build -d; cd ..\session_server\; docker-compose up --build -d; cd ..\frontend\; npm i; npm run serve
*/