<template>
  <div>
    <editor
      id="editor"
      v-model="content"
      @init="editorInit"
      lang="javascript"
      theme="monokai"
      width="100%"
      height="100%"
    ></editor>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Editor",
  props: ["someUnrelatedVar"],
  data: function() {
    return {
      content: ""
    };
  },
  created() {
    axios
      .get("http://localhost:4000/download", {
        params: {
          uploadPath: this.$route.params.file
        }
      })
      .then(result => {
        console.log(result.data)
        this.content = result.data;
      })
      .catch(err => {
        console.log("Log: getFoldersAndFiles -> err", err);
      });
  },
  components: {
    editor: require("vue2-ace-editor")
  },
  methods: {
    editorInit: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/less");
      require("brace/theme/monokai");
      require("brace/snippets/javascript"); //snippet
      require("../services/editor"); //snippet
      require("../services/rga"); //snippet
    }
  }
};
</script>

<style>
#editor {
  position: absolute;
  font-size: 16px;
}
</style>
