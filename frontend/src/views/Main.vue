<template>
  <div>
    <v-container>
      <v-btn block dark class="my-10" @click="toNewEditor()">Go To Editor</v-btn>
    </v-container>
    <v-container>
      <v-card width="90%" class="mx-auto" raised>
        <v-list rounded>
          <v-subheader inset v-if="currentPath !== '/'" class="subheader-if">
            <div class="back-button">
              <v-btn icon @click="previousPage(currentPath)">
                <v-icon color="grey lighten-1">mdi-keyboard-backspace</v-icon>
              </v-btn>
            </div>Folders
            <v-spacer></v-spacer>

            <v-btn small @click.stop="dialogFolder = true" style="width: 170px;">
              New Folder
              <v-spacer></v-spacer>
              <v-icon color="grey lighten-1">mdi-folder-plus</v-icon>
            </v-btn>
          </v-subheader>
          <v-subheader inset v-else>
            Folders
            <v-spacer></v-spacer>

            <v-btn small @click.stop="dialogFolder = true" style="width: 170px;">
              New Folder
              <v-spacer></v-spacer>
              <v-icon color="grey lighten-1">mdi-folder-plus</v-icon>
            </v-btn>
          </v-subheader>

          <transition-group name="list" tag="div">
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
          </transition-group>

          <v-divider inset></v-divider>

          <v-subheader inset style="margin-top: 8px;">
            Files
            <v-spacer></v-spacer>

            <v-btn small dark @click.stop="dialogFile = true" style="width: 170px;">
              New File
              <v-spacer></v-spacer>
              <v-icon color="grey lighten-1">mdi-file-plus</v-icon>
            </v-btn>
          </v-subheader>

          <transition-group name="list" tag="div">
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
          </transition-group>
        </v-list>
      </v-card>
      <v-dialog v-model="dialogFolder" max-width="290" persistent>
        <v-card>
          <v-card-title class="headline">Add a new folder?</v-card-title>

          <v-card-text>
            <v-text-field label="Folder Name" v-model="newFolderName"></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="red darken-1" text @click="dialogFolder = false">Close</v-btn>

            <v-btn color="grey darken-1" text outlined @click="newFolder(newFolderName)">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogFile" max-width="290" persistent>
        <v-card>
          <v-card-title class="headline">Add a new file?</v-card-title>

          <v-card-text>
            <v-text-field label="File Name" v-model="newFileName"></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="red darken-1" text @click="dialogFile = false">Close</v-btn>

            <v-btn color="grey darken-1" text outlined @click="newFile(newFileName)">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    ],
    dialogFile: false,
    dialogFolder: false,
    newFileName: "",
    newFolderName: ""
  }),
  mounted() {
    this.getFoldersAndFiles();
  },
  methods: {
    getFoldersAndFiles(folder) {
      this.folders = [];
      this.files = [];
      if (folder) {
        this.currentPath = this.currentPath + folder + "/";
      }
      axios
        .get("http://" + config.BACKEND_ADDR + "/upload", {
          params: {
            folders: this.currentPath
          },
          headers: { userId: this.$cookies.get("userId") }
        })
        .then(result => {
          const files = [];
          const folders = [];
          result.data.forEach(element => {
            if (!element.includes("/")) {
              files.push({
                title: element
              });
            } else {
              folders.push({
                title: element.split("/")[0]
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
      this.$cookies.set("filePath", this.currentPath + file);
      this.$router.push({
        name: "Editor",
        params: { file: this.currentPath + file }
      });
    },
    newFile(filename) {
      this.dialogFile = false;
      axios
        .post(
          "http://" + config.BACKEND_ADDR + "/upload",
          {
            type: "file",
            uploadPath: this.currentPath + filename,
            data: ""
          },
          { headers: { userId: this.$cookies.get("userId") } }
        )
        .then(
          response => {
            this.newFileName = "";
            this.getFoldersAndFiles();
          },
          error => {
            console.log(error);
          }
        );
    },
    newFolder(folderName) {
      this.dialogFolder = false;
      axios
        .post(
          "http://" + config.BACKEND_ADDR + "/upload",
          {
            type: "folder",
            uploadPath: this.currentPath + folderName,
            data: ""
          },
          { headers: { userId: this.$cookies.get("userId") } }
        )
        .then(
          response => {
            this.newFolderName = "";
            this.getFoldersAndFiles();
          },
          error => {
            console.log(error);
          }
        );
    },
    toNewEditor() {
      this.$cookies.set("filePath", "/temp.txt");
      this.$router.push({
        name: "Editor",
        params: { file: "/temp.txt" }
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
  padding: 0 16px 0 0;
}
.back-button {
  display: flex;
  width: 72px;
  justify-content: center;
}
.v-btn__content {
  width: 140px;
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}

.list-leave-active {
  transition: opacity 0.5s;
}

.list-enter-active {
  transition: opacity 0.5s;
  transition-delay: 0.5s;
}

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
