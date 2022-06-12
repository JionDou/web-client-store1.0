<template>
  <div class="table">
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
    </section>
    <section class="ces-handle" v-if="isHandle">
      <el-row style="display: flex;align-items: center;">
        <el-col :span="12">
          <el-input
            v-model="searchData.taskName"
            style="width:180px;margin-right:10px"
            placeholder="搜索文件名或ID"
            clearable
          ></el-input>
          <el-date-picker
            v-model="searchData.startTime"
            :value-format="'yyyy-MM-dd'"
            format="yyyy-MM-dd"
            style="width:180px;"
            placeholder="时间"
          ></el-date-picker>
          <el-button
            @click="searchTask"
            type="success"
            icon="el-icon-search"
            style="margin-left:10px;"
          ></el-button>
        </el-col>
        <el-col
          :span="12"
          style="display: flex;align-items: center;justify-content: flex-end;"
        >
          <el-button
            v-for="(item, index) in tableHandles"
            size="medium"
            :type="item.type"
            :icon="item.icon"
            @click="item.handle()"
            :key="index"
            >{{ item.label }}</el-button
          >
        </el-col>
      </el-row>
    </section>
    <section class="ces-dialog">
      <add-task-dialog ref="addTask"></add-task-dialog>
      <edit-task-dialog ref="editTask"></edit-task-dialog>
      <detail-task-dialog ref="detailTask"></detail-task-dialog>
      <custom-model-dialog ref="customModel"></custom-model-dialog>
    </section>
    <!-- end 弹窗组件 -->

    <el-table
      :data="tableData"
      :size="size"
      :border="isBorder"
      @select="select"
      @select-all="selectAll"
      v-loading="loading"
      header-row-class-name="header_row_style"
      :defaultSelections="defaultSelections"
      ref="cesTable"
      :header-cell-style="{
        'background-color': '#ddd',
        color: '#333'
      }"
      style="border: 1px solid #e6e6e6;border-bottom:none;border-radius: 4px;"
    >
      <el-table-column
        v-if="isSelection"
        type="selection"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in tableCols"
        :key="index"
        :prop="item.prop"
        :sortable="isColSupportSort(item.prop)"
        :label="item.label"
        :width="item.width"
        align="center"
        show-overflow-tooltip
        :render-header="item.require ? renderHeader : null"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="item.type === 'Status'"
            :type="scope.row.status | statusFilter"
            :size="size"
            >{{ scope.row.status }}</el-tag
          >
          <el-link
            v-if="item.type === 'Diff'"
            :type="scope.row.diff | diffFilter"
            >{{ scope.row.diff == 0 ? "无" : "有差异" }}</el-link
          >
          <template v-if="item.prop === 'options'">
            <el-link
              v-for="(itemx, index) in item.opts"
              :key="index"
              type="primary"
              :underline="false"
              @click="handleButton(scope.row, itemx)"
              style="margin-right:5px;font-size:14px;cursor: pointer;"
              >{{ itemx.label }}</el-link
            >
          </template>
          <span v-if="item.type === 'Date'">{{
            scope.row[item.prop] | parseTime("{y}-{m}-{d}")
          }}</span>

          <span
            v-if="!item.type"
            :style="item.itemStyle && item.itemStyle(scope.row)"
            :class="item.itemClass && item.item.itemClass(scope.row)"
            >{{
              (item.formatter && item.formatter(scope.row)) ||
                scope.row[item.prop]
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
        column-key="option"
        v-if="optionOpen"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            v-if="arrIncludes(optionsArr, 'edit')"
            @click="editRow(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="primary"
            v-if="arrIncludes(optionsArr, 'detail')"
            @click="detailRow(scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <section class="ces-pagination" v-if="isPagination">
      <el-row style="margin-top:10px;">
        <el-col :span="12">
          <el-button
            v-for="(item, index) in tableFootHandles"
            size="small"
            :type="item.type"
            :icon="item.icon"
            @click="item.handle()"
            :key="index"
            >{{ item.label }}</el-button
          >
        </el-col>
        <el-col :span="12" style="float:right;">
          <el-pagination
            style="display: flex;justify-content: center;height: 100%;align-items: center;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="total,sizes ,prev, pager, next,jumper"
            :page-size="pagination.pageSize"
            :current-page="pagination.pageNum"
            :total="pagination.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import EditTaskDialog from "./common/EditTaskDialog";
// import { parseTime } from "@/utils";
import DetailTaskDialog from "./common/DetailTaskDialog.vue";
import CustomModelDialog from "@/components/TaskTable/CustomModelDialog/CustomModelDialog";
import TaskModelDialog from "./common/TaskModelDialog.vue";
import AddTaskDialog from "./common/AddTaskDialog.vue";
export default {
  name: "TaskTable",
  components: {
    EditTaskDialog,
    DetailTaskDialog,
    CustomModelDialog,
    TaskModelDialog,
    AddTaskDialog
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        open: "success",
        close: "danger"
      };
      return statusMap[status];
    },
    diffFilter(status) {
      const statusMap = ["success", "danger"];
      return statusMap[status];
    }
  },
  props: {
    name: String,
    // 表格型号：mini,medium,small
    size: { type: String, default: "medium" },
    isBorder: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    // 表格操作
    isHandle: { type: Boolean, default: true },
    tableHandles: { type: Array, default: () => [] },
    // 表格数据
    tableData: { type: Array, default: () => [] },
    listHeaders: { type: Array, default: () => [] },
    // 表格列配置
    tableCols: { type: Array, default: () => [] },
    // 是否显示表格复选框
    isSelection: { type: Boolean, default: false },
    defaultSelections: { type: [Array, Object], default: () => null },
    // 是否显示表格索引
    isIndex: { type: Boolean, default: false },
    indexLabel: { type: String, default: "序号" },
    // 是否开启option
    optionOpen: {
      type: Boolean,
      default: false
    },
    //操作数组
    optionsArr: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否显示分页
    isPagination: { type: Boolean, default: true },
    // searchForm: { type: Array, default: [] },
    // searchHandle: { type: Array, default: () => [] },
    tableFootHandles: { type: Array, default: () => [] }, //表格底部按钮
    // 分页数据
    pagination: {
      type: Object,
      default: () => ({ pageSize: 10, pageNum: 1, total: 0 })
    }
  },
  data() {
    return {
      dialogFormModelVisible: false,
      searchData: {},
      schemaData: {
        taskName: "",
        taskId: "",
        taskDesc: "",
        taskState: "",
        taskModel: "",
        taskReward: "",
        taskDateRange: ""
      },
      schemaForm: [],
      schemaHandle: []
    };
  },
  watch: {},
  mounted() {},
  methods: {
    arrIncludes(arr, item) {
      return arr.includes(item);
    },
    isColSupportSort(colName) {
      return (
        colName === "id" ||
        colName === "name" ||
        colName === "update" ||
        colName === "version"
      );
    },
    handleCreate(val) {
      this.$refs.form.dialogFormModelVisible = false;
      console.log(this.schemaData);
    },
    handleButton(item, itemx) {
      this.$refs.addTask.dialogFormModelVisible = true;
      if (itemx.prop === "edit") {
        //获取编辑任务模板数据
        this.$refs.editTask.getModelTaskData();
        this.$refs.editTask.dialogEditFormVisible = true;
        this.$nextTick(() => {
          this.$refs.editTask.getEditTaskById(item.id);
        });
      } else if (itemx.prop === "view") {
        //获取查看任务模板数据
        this.$refs.detailTask.getModelTaskData();
        this.$refs.detailTask.getDetailTaskId(item.id);
        this.$refs.detailTask.dialogDetailFormVisible = true;
      }
      // this.$emit("handleButton", row);
    },
    searchTask() {
      this.pagination.pageNum = 1;
      this.$emit("refresh");
      this.$emit("search", this.searchData);
    },
    selectionResultHandler(value) {
      this.defaultSelectedList = value;
    },
    showAddDialog() {
      console.log(`子组件:`);
      this.$refs.addTask.createModelTask();
      this.$refs.addTask.dialogFormVisible = true;
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
.el-pagination {
  float: right;
  margin-right: 10px;
  margin-top: 5px;
}
::v-deep {
  .el-table__empty-block {
    width: 100% !important;
  }
  .el-table__header {
    width: 100% !important;
  }
}
</style>
