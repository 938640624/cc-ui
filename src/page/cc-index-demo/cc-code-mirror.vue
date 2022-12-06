<template>
  <div class="code-mirror-page">
    <cc-header :headtitle="'CodeMirror(在线编辑器)'"/>
    <cc-scroll>
      <textarea ref="mycode" class="codesql" v-model="code"></textarea>
    </cc-scroll>
  </div>
</template>
<script>
const COMPONENT_NAME = "code-mirror-page";
import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
let CodeMirror = require("codemirror/lib/codemirror");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/mode/sql/sql");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/sql-hint");
import ccHeader from "../../components/cc-header/cc-header.vue";
import ccScroll from "../../components/cc-scroll/cc-scroll.vue";
export default {
  name: COMPONENT_NAME,
  components: {
    ccHeader,
    ccScroll,
  },
  mounted() {
    let mine = 'text/x-mariadb'
    let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
      mode: mine,//选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets: true,
      extraKeys: {'Ctrl': 'autocomplete'},//自定义快捷键
      hintOptions: {//自定义提示选项
        tables: {
          users: ['name', 'score', 'birthDate'],
          countries: ['name', 'population', 'size']
        }
      }
    })
    //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
    editor.on('cursorActivity', function () {
      editor.showHint()
    })
  },
  data() {
    return {
      code: '按ctrl进行代码提示'
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.codesql {
    font-size: 11pt;
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
  }
</style>