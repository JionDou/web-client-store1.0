<template>
  <section class="ces-table-page">
    <section class="ces-dialog">
      <component
        :is="newTaskActiveDialog.name"
        ref="newTaskActiveDialog"
      ></component>
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
import TableList from "@/components/TaskTable/common/TableList/TableList";
import NewTaskActiveDialog from "@/components/TaskTable/qsm/NewTaskActive/NewTaskActiveDialog";
import { getQSMNewTaskProcessAct } from "@/api/table.js";

export default {
  name: "NewTaskActiveList",
  components: {
    NewTaskActiveDialog,
    TableList
  },
  data() {
    return {
      dialogFormModelVisible: false,
      loading: false,
      taskCfgData: {
        name: "TableList"
      },
      newTaskActiveDialog: {
        name: "NewTaskActiveDialog"
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
            this.$refs.newTaskActiveDialog.activeCfgModel();
          }
        },
        {
          label: "新增任务",
          type: "warning",
          handle: row => {
            console.log("新增任务");
            this.$refs.newTaskActiveDialog.addTask();
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
    this.getQSMNewTaskProcessAct();
  },
  methods: {
    //手游表格数据获取
    async getQSMNewTaskProcessAct() {
      this.loading = true;
      let params = {
        offset: 1,
        length: 5,
        branch: "trunk"
      };
      const res = await getQSMNewTaskProcessAct(params);
      if (res.code === 200 || res.code === 201) {
        this.tableData = res.data.content.items;
        this.tableData.forEach(x => {
          x.schema = x.schema.split("-")[1];
        });
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
      let id = row.header_id_1;
      this.$refs.newTaskActiveDialog.editTask(id);
    },
    detailRow(row) {
      let id = row.header_id_1;
      this.$refs.newTaskActiveDialog.detailTask(id);
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
