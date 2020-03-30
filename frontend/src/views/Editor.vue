<template>
  <div>
    <NavBar />
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <!-- <v-btn color="red lighten-2" dark v-on="on">Click Me</v-btn> -->
        <v-bottom-navigation absolute dark grow>
          <v-btn value="recent" @click="share()">
            <span>Start Session</span>
            <v-icon>mdi-presentation-play</v-icon>
          </v-btn>

          <v-btn value="favorites" @click="save()">
            <span>Save</span>
            <v-icon>mdi-content-save</v-icon>
          </v-btn>

          <v-btn value="nearby" v-on="on" v-if="content !== original">
            <span>Exit</span>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
          <v-btn value="nearby" v-else @click="exit()">
            <span>Exit</span>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
        </v-bottom-navigation>
        <editor
          id="editor"
          v-model="content"
          @init="editorInit"
          lang="javascript"
          theme="monokai"
          width="100%"
          height="95%"
        ></editor>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Do you want to leave this page?</v-card-title>

        <v-card-text
          class="pa-6"
          style="  display: flex;  justify-content: center;"
        >You have some unsaved changes</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn class="continue" text @click="exit()">Continue without saving</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="close" text @click="dialog = false">Close</v-btn>
          <v-btn class="save" text @click="saveAndExit()">Save and exit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
// import Session from "../services/editor";
import config from "../services/app.config";
export default {
  name: "Editor",
  props: ["someUnrelatedVar"],
  data: function() {
    return {
      content: "",
      original: "",
      dialog: false,
      filePath: ""
    };
  },
  created() {
    this.filePath = this.$route.params.file;
    axios
      .get("http://" + config.BACKEND_ADDR + "/download", {
        params: {
          uploadPath: this.filePath
        }
      })
      .then(result => {
        this.content = result.data;
        this.original = result.data;
      })
      .catch(err => {
        console.log(err);
      });
  },
  components: {
    editor: require("vue2-ace-editor")
  },
  methods: {
    editorInit: function(editor) {
      console.log("Log: editor", editor);
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/less");
      require("brace/theme/monokai");
      require("brace/snippets/javascript"); //snippet
      require("../services/editor");
    },
    exit() {
      this.$router.push("/");
    },
    save() {
      axios
        .post("http://" + config.BACKEND_ADDR + "/upload", {
          uploadPath: this.filePath,
          data: this.content
        })
        .then(
          response => {
            this.original = this.content;
          },
          error => {
            console.log(error);
          }
        );
    },
    saveAndExit() {
      this.save();
      this.exit();
    },
    share() {
      // Session.createSession();
    }
  }
};
</script>

<style scoped>
#editor {
  position: absolute;
  font-size: 16px;
}
.continue {
  background-color: #ff5252;
  color: white;
}

.save {
  background-color: #3f51b5;
  color: white;
}
</style>
