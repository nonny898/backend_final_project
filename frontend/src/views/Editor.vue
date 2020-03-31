<template>
  <div>
    <v-toolbar dark dense style="position: -webkit-sticky;position: sticky;top: 20px;">
      <v-row no-gutters>
        <v-col style="display: flex;align-items: center;">
          <v-btn :hidden="connected" value="join" @click="joinSessionDialog = true">
            <span>Join Session</span>
            <v-icon>mdi-presentation</v-icon>
          </v-btn>

          <v-btn :hidden="connected" value="create" @click="share()">
            <span>Start Session</span>
            <v-icon>mdi-presentation-play</v-icon>
          </v-btn>

          <v-btn v-if="connected" value="disconnect" @click="disconnect()">
            <span>Disconnect</span>
            <v-icon>mdi-access-point-network-off</v-icon>
          </v-btn>
          <v-btn v-if="connected" dark @click="snackbar = true">Show Session ID</v-btn>
        </v-col>

        <!-- <v-toolbar-title> -->
        <!-- <span v-if="connected === true" style="margin-right:10px">Connected</span> -->
        <!-- <span v-else style="margin-right:10px">Disconnect</span> -->
        <v-col style="display: flex;justify-content: center;">
          <v-chip
            v-if="connected === true"
            small
            class="ma-2"
            color="green"
            text-color="white"
          >Connected</v-chip>
          <v-chip v-else small class="ma-2" color="red" text-color="white">Disconnect</v-chip>
        </v-col>

        <!-- </v-toolbar-title> -->

        <v-col style="display: flex;justify-content: flex-end;align-items: center;">
          <v-avatar class="mx-2" color="white" size="30" v-if="connected === true">
            <span class="black--text">{{ users }}</span>
          </v-avatar>
          <v-btn v-if="temp" value="saveAs" @click.stop="dialogFile = true">
            <span>Save As</span>
            <v-icon>mdi-content-save-edit</v-icon>
          </v-btn>

          <v-btn v-else value="save" @click="save()">
            <span>Save</span>
            <v-icon>mdi-content-save</v-icon>
          </v-btn>

          <v-btn value="exit" @click.stop="dialog = true" v-if="content !== original">
            <span>Exit</span>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
          <v-btn value="exit" v-else @click="exit()">
            <span>Exit</span>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <editor
      id="editor"
      v-model="content"
      @init="editorInit"
      lang="javascript"
      theme="monokai"
      width="100%"
      height="100%"
    ></editor>

    <v-dialog v-model="joinSessionDialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Join a session?</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Session Id*" required v-model="joinSessionId"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="joinSessionDialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="joinSession()">Join</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogFile" max-width="290" persistent>
      <v-card>
        <v-card-title class="headline">Save as?</v-card-title>

        <v-card-text>
          <v-text-field
            label="File Path"
            v-model="newFileName"
            hint="For example, /example/file.ext"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="dialogFile = false">Close</v-btn>

          <v-btn color="grey darken-1" text outlined @click="newFile(newFileName)">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" width="500">
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
    <v-snackbar v-model="snackbar">
      Session Id: {{ sessionId }}
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
// import Session from "../services/editor";
import config from "../services/app.config";
import SocketIO from "socket.io-client";
import RGA from "../services/rga";
export default {
  name: "Editor",
  props: ["someUnrelatedVar"],
  data: function() {
    return {
      users: 0,
      sessionId: "",
      joinSessionId: "",
      connected: false,
      content: "",
      original: "",
      dialog: false,
      filePath: "/",
      socket: null,
      rga: null,
      session: null,
      doc: null,
      editor: null,
      joinSessionDialog: false,
      newFileName: "",
      dialogFile: false,
      temp: false,
      snackbar: false
    };
  },
  created() {
    this.filePath = this.$cookies.get("filePath");
    console.log("Log: created -> this.filePath", this.filePath);
    if (this.filePath === null) {
      this.$router.push({
        name: "Main"
      });
    } else if (this.filePath !== "/temp.txt") {
      axios
        .get("http://" + config.BACKEND_ADDR + "/download", {
          params: {
            uploadPath: this.filePath
          },
          headers: { userId: this.$cookies.get("userId") }
        })
        .then(result => {
          this.content = result.data;
          this.original = result.data;
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.temp = true;
    }
  },
  components: {
    editor: require("vue2-ace-editor")
  },
  methods: {
    createSession: function() {
      console.log("Creating request to make session");
      axios
        .get(`http://${config.SESSION_ADDR}/create`, {
          headers: { userId: this.$cookies.userId }
        })
        .then(result => {
          console.log("shit", result.data);
          this.openConnection(result.data, true);
        });
    },
    // TODO : Make a text box so that ppl who want na join the session
    // can paste the sessoin id into
    joinSession: function() {
      this.connected = true;
      this.joinSessionDialog = false;
      this.openConnection(this.joinSessionId, false);
    },
    disconnect: function() {
      this.users = 0;
      this.sessionId = "";
      this.connected = false;
      if (this.rga !== undefined || this.rga !== null) {
        this.rga.unsubscribe();
        this.socket.disconnect(true);
      }
    },
    openConnection: function(sessionId, isCreator) {
      if (this.connected) {
        this.disconnect();
      }
      console.log("Opening socket on url " + sessionId);
      let socket = SocketIO(
        `http://${config.SESSION_ADDR}`,
        {
          query: "session=" + sessionId
        },
        { forceNew: true }
      );
      this.socket = socket;
      this.socket.on("init", ({ id, history }) => {
        console.log("Got id " + id);
        if (this.rga != undefined) this.rga.unsubscribe();
        let rga = new RGA.AceEditorRGA(id, this.editor);
        this.rga = rga;

        this.rga.subscribe(op => {
          this.socket.emit("message", op);
        });

        this.socket.on("connections", connections => {
          this.users = connections;
        });
        this.socket.on("message", op => {
          this.rga.receive(op);
          console.log(op);
        });
        this.socket.on("gtfo",status => {
          //TODO Do something with this status
          this.disconnect()
        })
        if (!isCreator)
          this.socket.emit("message", {
            type: "historyRequest"
          });
        else {
          const allTexts = this.doc.getAllLines().join("\n");
          this.session.setValue(allTexts);
        }
        this.editor.focus();
      });
      this.connected = true;
      this.sessionId = sessionId;
    },

    editorInit: function(editor) {
      this.editor = editor;
      this.session = editor.getSession();
      this.doc = this.session.getDocument();
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/less");
      require("brace/theme/monokai");
      require("brace/snippets/javascript"); //snippet
      require("../services/editor");
      editor.focus();
    },
    exit() {
      this.$cookies.remove("filePath");
      // this.disconnect();
      this.$router.push("/");
    },
    save() {
      axios
        .post(
          "http://" + config.BACKEND_ADDR + "/upload",
          {
            type: "file",
            uploadPath: this.filePath,
            data: this.content
          },
          { headers: { userId: this.$cookies.get("userId") } }
        )
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
      this.createSession();
    },
    newFile(filename) {
      this.dialogFile = false;
      this.temp = false;
      axios
        .post(
          "http://" + config.BACKEND_ADDR + "/upload",
          {
            type: "file",
            uploadPath: filename,
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

.v-toolbar__content {
  display: flex;
  justify-content: space-between;
}
</style>
