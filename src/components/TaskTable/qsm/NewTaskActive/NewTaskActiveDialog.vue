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
    ></component>
  </el-dialog>
</template>

<script>
import AddTask from "@/components/TaskTable/qsm/NewTaskActive/Dialog/AddTask";
import EditTask from "@/components/TaskTable/qsm/NewTaskActive/Dialog/EditTask";
import DetailTask from "@/components/TaskTable/qsm/NewTaskActive/Dialog/DetailTask";

import ActiveCfgModel from "@/components/TaskTable/qsm/NewTaskActive/Dialog/ActiveCfgModel";

export default {
  name: "NewTaskActiveDialog",
  computed: {},
  components: {
    AddTask,
    EditTask,
    DetailTask,
    ActiveCfgModel
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
    // 新增弹窗
    addTask() {
      this.dialog = {
        visible: true,
        title: "新增",
        name: "AddTask"
      };
    },
    // 编辑弹窗
    editTask(id) {
      this.dialog = {
        visible: true,
        title: "编辑",
        name: "EditTask",
        data: id
      };
      this.id = id;
    },
    // 查看弹窗
    detailTask(id) {
      this.dialog = {
        visible: true,
        title: "查看",
        name: "DetailTask",
        data: id
      };
      this.id = id;
    },
    // 活动配置模板弹窗
    activeCfgModel() {
      this.dialog = {
        visible: true,
        title: "活动配置模板",
        name: "ActiveCfgModel"
      };
    },
    closeDialog() {
      this.dialog = {
        title: "",
        Visible: false,
        name: ""
      };
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
