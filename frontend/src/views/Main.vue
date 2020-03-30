<template>
  <div>
    <NavBar />
    <v-container>
      <v-card width="90%" class="mx-auto">
        <v-list two-line subheader>
          <v-subheader inset>Folders</v-subheader>

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

          <v-subheader inset>Files</v-subheader>

          <v-list-item v-for="item in files" :key="item.title" @click="toEditor(item.title)">
            <v-list-item-avatar>
              <i class="fas fa-file-alt"></i>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "../components/NavBar";
import config from "../services/app.config"
export default {
  name: "Main",
  data: () => ({
    folders: [],
    files: [],
    currentPath: "/"
  }),
  components: {
    NavBar
  },
  mounted() {
    this.getFoldersAndFiles();
  },
  methods: {
    getFoldersAndFiles(folder) {
      if (folder){
        this.currentPath = this.currentPath + folder + "/"
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
          console.log("Log: getFoldersAndFiles -> err", err);
        });
    },
    toEditor(file) {
      this.$router.push({ name: "Editor", params: { file: this.currentPath + file } });
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