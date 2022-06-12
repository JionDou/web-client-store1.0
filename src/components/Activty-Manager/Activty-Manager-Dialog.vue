<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    class="abow_dialog"
    :id="dialog.id"
    :close-on-click-modal="false"
  >
    <!-- 新增任务动态弹窗组件 -->
    <component
      :is="dialog.name"
      :id="id"
      ref="dialog"
      @closeDialog="closeDialog"
      @getById="getById"
    ></component>
  </el-dialog>
</template>

<script>
import AddCfgTmpl from "@/components/Activty-Manager/common/AddCfgTmpl";
import AddCfgSchmea from "@/components/Activty-Manager/common/AddCfgSchmea";
import CfgSchmea from "@/components/Activty-Manager/common/CfgSchmea";
import CfgTmpl from "@/components/Activty-Manager/common/CfgTmpl";
import CustomTemplate from "@/components/Custom-template/Custom-template";
export default {
  name: "Activty-Manager-Dialog",
  computed: {},
  components: {
    AddCfgTmpl,
    AddCfgSchmea,
    CfgSchmea,
    CfgTmpl,
    CustomTemplate
  },
  data() {
    return {
      id: 0,
      //弹窗组件默认值
      dialog: {
        title: "",
        visible: false,
        name: ""
      },
      activeName: "universe"
    };
  },
  watch: {},
  mounted() {},
  methods: {
    //新增任务
    addSchema() {
      this.dialog = {
        visible: true,
        title: "新增任务",
        name: "AddCfgSchmea"
      };
    },
    //编辑任务
    editSchema(id) {
      this.dialog = {
        visible: true,
        title: "编辑任务",
        name: "CfgSchmea"
      };
      this.id = id;
    },
    //查看任务
    viewSchema(id) {
      this.dialog = {
        visible: true,
        title: "查看任务",
        name: "CfgSchmea"
      };
      this.id = id;
    },
    //编辑表单模板弹窗
    customTemplate() {
      this.dialog = {
        visible: true,
        title: "编辑表单模板",
        name: "Custom-template"
      };
    },
    //新增数值模板弹窗
    cfgTmpl() {
      this.dialog = {
        visible: true,
        title: "新增数值模板",
        name: "AddCfgTmpl"
      };
    },
    editCfgTmpl(id) {
      this.dialog = {
        visible: true,
        title: "编辑数值模板",
        name: "CfgTmpl"
      };
      this.id = id;
    },
    viewCfgTmpl(id) {
      this.dialog = {
        visible: true,
        title: "查看数值模板",
        name: "CfgTmpl"
      };
      this.id = id;
    },
    closeDialog() {
      this.dialog = {
        title: "",
        Visible: false,
        name: ""
      };
    },
    getById(id) {
      this.dialog = {
        title: "",
        Visible: false,
        name: ""
      };
      this.id = id;
    }
  }
};
</script>

<style scoped lang="scss">
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
  ::v-deep {
    .el-dialog {
      margin: 0 auto !important;
      height: 70%;
      overflow: hidden;
      width: 65%;
      .el-dialog__body {
        position: absolute;
        left: 0;
        top: 54px;
        bottom: 0;
        right: 0;
        padding: 0;
        z-index: 1;
        overflow: hidden;
        overflow-y: auto;
      }
      ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      ::-webkit-scrollbar-thumb {
        /*滚动条的背景色*/
        background-color: rgba(144, 147, 153, 0.6);
        border-radius: 35px;
        position: relative;
      }
    }
  }
}
</style>
