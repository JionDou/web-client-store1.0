<template>
  <section class="ces-table-page">
    <el-row style="margin-bottom:40px;">
      <el-col
        :span="24"
        style="display: flex;align-items: center;justify-content:flex-end;"
      >
        <el-button size="medium">历史任务白名单</el-button>
        <el-button size="medium" type="info" plain @click="taskModel"
          >任务模板库</el-button
        >
        <el-button size="medium" type="info" plain @click="taskModelTree"
          >模板树</el-button
        >
      </el-col>
    </el-row>

    <section class="TaskModelDialog">
      <task-model-dialog
        ref="form"
        size="mini"
        labelWidth="50px"
        :schemaData="schemaData"
        :schemaForm="schemaForm"
        :schemaHandle="schemaHandle"
      ></task-model-dialog>
    </section>
    <!-- end 任务模板库 -->

    <section class="ces-dialog">
      <component :is="activeCfgDialog.name" ref="activeCfgDialog"></component>
    </section>
    <!-- end 弹窗组件 -->

    <!-- 表格动态组件 -->
    <section class="ces-table">
      <component
        :is="taskCfgData.name"
        ref="taskCfgData"
        :isSelection="true"
        :isIndex="true"
        :isPagination="true"
        :isHandle="true"
        :isDialog="true"
        :loading="loading"
        :tableData="tableData"
        :tableCols="tableCols"
        :optionsArr="optionsArr"
        :tableHandles="tableHandles"
        :optionOpen="true"
        :tableFootHandles="tableFootHandles"
        :pagination="pagination"
        @editRow="editRow"
        @detailRow="detailRow"
        @refresh="handleCurrentChange"
      ></component>
    </section>
  </section>
</template>

<script>
import CustomModelDialog from "@/components/TaskTable/CustomModelDialog/CustomModelDialog";
import TaskModelDialog from "@/components/TaskTable/common/TaskModelDialog";
import TableList from "@/components/TaskTable/common/TableList/TableList";
import ActiveCfgDialog from "@/components/TaskTable/qsm/ActiveCfgList/ActiveCfgDialog";
import { getMobileTableData } from "@/api/table.js";

export default {
  name: "ActiveCfgList",
  components: {
    CustomModelDialog,
    TaskModelDialog,
    ActiveCfgDialog,
    TableList
  },
  data() {
    return {
      dialogFormModelVisible: false,
      loading: false,
      taskCfgData: {
        name: "TableList"
      },
      activeCfgDialog: {
        name: "ActiveCfgDialog"
      },
      tableData: [],
      tableCols: [{ label: "操作", prop: "options", type: "Function" }],
      optionsArr: ["edit", "detail"],
      searchData: {},
      schemaData: {},
      schemaForm: [],
      schemaHandle: [],
      tableHandles: [
        {
          label: "活动配置模板",
          type: "success",
          handle: row => {
            console.log("点击了活动配置模板");
            // this.$router.push("/CustomModel");
            this.$refs.activeCfgDialog.cfgFormModel();
          }
        },
        {
          label: "新增任务",
          type: "warning",
          handle: row => {
            console.log("新增任务");
            this.$refs.activeCfgDialog.addTask();
          }
        }
      ],
      tableFootHandles: [
        {
          label: "批量测试",
          type: "warning",
          handle: () => {
            console.log("点击了批量测试");
          }
        },
        {
          label: "批量打包",
          type: "warning",
          handle: () => {
            console.log("点击了批量打包");
          }
        },
        {
          label: "批量下架",
          type: "success",
          handle: () => {
            console.log("点击了批量下架");
          }
        }
      ],
      //分页数据
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
        timestamp: new Date()
      }
    };
  },
  watch: {},
  mounted() {
    this.getMobileTableData();
  },
  methods: {
    //手游表格数据获取
    async getMobileTableData() {
      this.loading = true;
      let params = {
        offset: 1,
        length: 5,
        branch: "trunk"
      };
      const res = await getMobileTableData(params);
      if (res.code === 200 || res.code === 201) {
        this.tableData = res.data.content.items;
        this.tableCols = res.data.meta_data.headers;
        this.pagination.total = res.data.content.total;
        this.pagination.offset = res.data.content.offset;
        this.pagination.length = res.data.content.length;
        this.loading = false;
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    editRow(row) {
      this.$refs.activeCfgDialog.editTask(row.id);
    },
    detailRow(row) {
      this.$refs.activeCfgDialog.detailTask(row.id);
    },
    handleReset() {
      this.schemaData = {
        taskName: "",
        taskId: "",
        taskDesc: "",
        taskState: "",
        taskModel: "",
        taskReward: "",
        taskDateRange: ""
      };
    },
    handleCreate(val) {
      this.$refs.form.dialogFormModelVisible = false;
      console.log(this.schemaData);
    },

    searchTask() {
      this.pagination.pageNum = 1;
      this.$emit("refresh");
    },
    selectionResultHandler(value) {
      this.defaultSelectedList = value;
    },

    // 表格勾选
    select(rows, row) {
      this.$emit("selectid", rows, row);
    },
    // 全选
    selectAll(rows) {
      this.$emit("select", rows);
    },
    //
    handleCurrentChange(val) {
      this.pagination.pageNum = val;
      this.$emit("refresh");
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.$emit("refresh");
    },

    renderHeader(h, obj) {
      return h("span", { class: "ces-table-require" }, obj.column.label);
    },
    taskModel() {
      this.$refs.form.dialogFormModelVisible = true;
    },
    taskModelTree() {
      this.$refs.customModel.dialogCustomModelVisible = true;
    }
  }
};
</script>

<style scoped lang="scss">
.ces-handle {
  padding-bottom: 20px;
}
.ces-table-require::before {
  content: "*";
  color: red;
}
.el-pagination {
  float: right;
  margin-right: 10px;
  margin-top: 5px;
}
::v-deep {
  .el-table__empty-block {
    width: 100% !important;
  }
}
</style>
