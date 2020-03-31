<template>
  <div>
    <NavBar />
    <v-container>
      <v-card width="90%" class="mx-auto">
        <v-list rounded>
          <v-subheader inset v-if="currentPath !== '/' " class="subheader-if">
            <div class="back-button">
              <v-btn icon @click="previousPage(currentPath)">
                <v-icon color="grey lighten-1">mdi-keyboard-backspace</v-icon>
              </v-btn>
            </div>Folders
            <v-spacer></v-spacer>

            <v-btn small @click="previousPage(currentPath)" style="width: 170px;">
              New Folder
              <v-spacer></v-spacer>
              <v-icon color="grey lighten-1">mdi-folder-plus</v-icon>
            </v-btn>
          </v-subheader>
          <v-subheader inset v-else>
            Folders
            <v-spacer></v-spacer>

            <v-btn small @click="previousPage(currentPath)" style="width: 170px;">
              New Folder
              <v-spacer></v-spacer>
              <v-icon color="grey lighten-1">mdi-folder-plus</v-icon>
            </v-btn>
          </v-subheader>

          <v-list-item
            v-for="item in folders"
            :key="item.title"
            @click="getFoldersAndFiles(item.title)"
          >
            <v-list-item-avatar>
              <i class="fas fa-folder"></i>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-subheader inset>Files

            <v-spacer></v-spacer>

            <v-btn small @click="previousPage(currentPath)" style="width: 170px;">
              New File
              <v-spacer></v-spacer>
              <v-icon color="grey lighten-1">mdi-folder-plus</v-icon>
            </v-btn>
          </v-subheader>

          <v-list-item v-for="item in files" :key="item.title" @click="toEditor(item.title)">
            <v-list-item-avatar>
              <i class="fas fa-file-alt"></i>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-open-in-new</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import config from "../services/app.config";
export default {
  name: "Main",
  data: () => ({
    folders: [],
    files: [],
    currentPath: "/",
    items: [
      {
        text: "Dashboard",
        disabled: false,
        href: "breadcrumbs_dashboard"
      },
      {
        text: "Link 1",
        disabled: false,
        href: "breadcrumbs_link_1"
      },
      {
        text: "Link 2",
        disabled: true,
        href: "breadcrumbs_link_2"
      }
    ]
  }),
  mounted() {
    this.getFoldersAndFiles();
  },
  methods: {
    getFoldersAndFiles(folder) {
      if (folder) {
        this.currentPath = this.currentPath + folder + "/";
      }
      axios
        .get("http://" + config.BACKEND_ADDR + "/upload", {
          params: {
            folders: this.currentPath
          }
        })
        .then(result => {
          const files = [];
          const folders = [];
          result.data.forEach(element => {
            if (element.includes(".")) {
              files.push({
                title: element
              });
            } else {
              folders.push({
                title: element
              });
            }
          });
          this.folders = folders;
          this.files = files;
        })
        .catch(err => {
          console.log(err);
        });
    },
    previousPage(path) {
      this.currentPath =
        path
          .split("/")
          .filter(function(e) {
            return e;
          })
          .slice(0, -1)
          .join("/") + "/";
      this.getFoldersAndFiles();
    },
    toEditor(file) {
      this.$router.push({
        name: "Editor",
        params: { file: this.currentPath + file }
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
.subheader-if {
  margin: 0;
  padding: 0;
}
.back-button {
  display: flex;
  width: 72px;
  justify-content: center;
}
.v-btn__content{
  width: 140px;
}
</style>