<template>
  <el-dialog
    :title="dialogCustomTree.title"
    :visible.sync="dialogCustomModelVisible"
    class="abow_dialog"
    :close-on-click-modal="false"
    @opened="initForm"
  >
    <component :is="dialogCustomTree.name" ref="dialogCustomTree"></component
    ><!-- 动态组件:子组件 -->
  </el-dialog>
</template>

<script>
import CustomTree from "./common/CustomTree";
export default {
  components: {
    CustomTree
  },
  data() {
    return {
      customModelDialog: "任务模板树",
      dialogCustomModelVisible: false,
      dialogCustomTree: {
        // 弹窗组件传递数据
        title: "任务模板树",
        visible: false,
        width: "",
        name: "CustomTree" // 组件名
      }
    };
  },
  mounted() {},
  methods: {
    // 弹窗打开回调（更新数据）
    initForm() {
      // if (this.dialogCustomTree.name) {
      //   this.$refs.dialogCustomTree.initForm(this.dialogCustomTree.initGo());
      // }
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
        background-color: rgba(144, 147, 153, 0.3);
        border-radius: 35px;
        position: relative;
      }
    }
  }
}
</style>
