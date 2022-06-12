<template>
  <!-- 任务配置:列表 -->
  <section class="ces-table-page">
    <section class="ces-dialog">
      <component :is="taskCfgDialog.name" ref="taskCfgDialog"></component>
    </section>

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
        :tableHandles="tableHandles"
        :tableFootHandles="tableFootHandles"
        @optClick="handleOptClick"
        :pagination="pagination"
        @refresh="refresh"
        @search="search"
      ></component>
    </section>
  </section>
</template>

<script>
import TableList from "@/components/TaskTable/common/TableList/TableList";
import { getCfgList } from "@/api/mShowType"; //列表数据

import TaskCfgDialog from "@/components/TaskTable/TaskCfgList/TaskCfgDialog";
export default {
  name: "TaskCfgList",
  components: {
    TableList,
    TaskCfgDialog,
  },
  data() {
    return {
      loading: false,
      taskCfgData: {
        name: "TableList",
      },
      taskCfgDialog: {
        name: "TaskCfgDialog",
      },
      tableAllData: [],
      tableSearchData: [],
      tableData: [],
      tableCols: [],
      tableHandles: [
        {
          label: "任务白名单",
          type: "success",
          handle: () => {
            console.log("点击了任务白名单");
            this.$refs.ruleForm.getModelFromData();
          },
        },
        {
          label: "新增任务",
          type: "warning",
          handle: () => {
            console.log("点击了新增任务");
            this.$refs.taskCfgDialog.addTask();
          },
        },
      ],
      tableFootHandles: [
        {
          label: "批量测试",
          type: "warning",
          handle: () => {
            console.log("点击了批量测试");
          },
        },
        {
          label: "批量打包",
          type: "warning",
          handle: () => {
            console.log("点击了批量打包");
          },
        },
        {
          label: "批量下架",
          type: "success",
          handle: () => {
            console.log("点击了批量下架");
          },
        },
      ],
      //分页数据
      pagination: {
        pageSize: 30,
        pageNum: 1,
        total: 0,
        timestamp: new Date(),
      },
    };
  },
  watch: {},
  mounted() {
    this.getCfgList();
  },
  methods: {
    //获取端游任务配置表格数据
    async getCfgList() {
      this.loading = true;

      const res = await getCfgList("task");
      if (res.code === 200 || res.code === 201) {
        this.tableAllData = res.data.content.items;
        this.tableCols = res.data.meta_data.headers;
        this.pagination.total = this.tableAllData.length;
        this.pagination.offset = res.data.content.offset;
        this.pagination.pageNum = 1;
        this.pagination.length = res.data.content.length;
        this.tableSearchData = this.tableAllData;
        this.pagination.total = this.tableSearchData.length;
        this.refresh();
        this.loading = false;
      } else {
        this.$message({
          type: "error",
          message: res.message,
        });
      }
    },
    refresh() {
      let start = (this.pagination.pageNum - 1) * this.pagination.pageSize;
      let end = this.pagination.pageNum * this.pagination.pageSize;
      if (end > this.pagination.total) {
        end = this.pagination.total;
      }
      this.tableData = this.tableSearchData.slice(start, end);
    },
    search(val) {
      console.log(val);
      this.searchData = val;
      if (val.taskName || val.startTime) {
        this.tableSearchData = this.tableAllData.filter(function (item) {
          if (val.startTime && item.time.slice(0, 10) !== val.startTime)
            return false;
          if (
            val.taskName &&
            (item.name.indexOf(val.taskName) < 0 &&
              (item.id + "").indexOf(val.taskName)) < 0
          )
            return false;
          return true;
        });
      } else {
        this.tableSearchData = this.tableAllData;
      }
      this.pagination.total = this.tableSearchData.length;
      this.pagination.pageNum = 1;
      this.refresh();
    },
    handleOptClick(item, itemx) {
      console.log("handleOptClick", item.id);
      let id = item.id;
      if (itemx.prop === "edit") {
        this.$refs.taskCfgDialog.editTask(id);
      } else if (itemx.prop === "view") {
        this.$refs.taskCfgDialog.detailTask(id);
      }
    },
  },
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
