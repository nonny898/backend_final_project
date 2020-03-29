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
export default {
  name: "Editor",
  data: function() {
    return {
      content: ""
    };
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
