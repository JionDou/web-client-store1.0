<template>
  <div class="table">
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

    <!-- 任务新增，编辑，查看页面弹窗 -->
    <!-- <section class="ces-dialog">
      <component :is="taskDialog.name" ref="taskDialog"></component>
    </section> -->
    <!-- end 任务页面弹窗 -->
    <el-table
      id="tableData"
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
        id="tableCol"
        v-for="(item, index) in tableCols"
        :key="index"
        :prop="item.prop"
        :sortable="isColSupportSort(item.prop)"
        :label="item.label"
        :width="item.width"
        align="center"
        show-overflow-tooltip
        class="cell"
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
        <el-col :span="12">
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
export default {
  name: "TableList",
  components: {},
  props: {
    // 表格型号：mini,medium,small
    size: { type: String, default: "medium" },
    isBorder: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    // 表格数据
    tableData: { type: Array, default: () => [] },
    // 表格列(表头)
    tableCols: { type: Array, default: () => [] },
    // 是否显示表格复选框
    isSelection: { type: Boolean, default: false },
    defaultSelections: { type: [Array, Object], default: () => null },
    // 表格操作
    isHandle: { type: Boolean, default: true },
    tableHandles: { type: Array, default: () => [] },
    tableFootHandles: { type: Array, default: () => [] }, //表格底部按钮
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
    // 分页数据
    pagination: {
      type: Object,
      default: () => ({ pageSize: 10, pageNum: 1, total: 0 })
    }
  },
  data() {
    return {
      searchData: {},
      taskDialog: {
        name: "TaskDialog"
      }
    };
  },
  // watch: {
  //   tableData(valArr) {
  //     console.log("Mounted");
  //     const _this = this;
  //     this.formThead = this.tableCols.map(function(value) {
  //       const arr = valArr.map(x => x[value.prop]); // 获取每一列的所有数据
  //       arr.push(value.label); // 把每列的表头也加进去算
  //       value.width = _this.getMaxLength(arr) + 20; // 每列内容最大的宽度 + 表格的内间距(依据实际情况而定)
  //       return value;
  //     });
  //     console.log(this.tableData);
  //     console.log(this.tableCols);
  //   }
  // },
  mounted() {},
  methods: {
    //遍历列的所有内容，获取最宽一列的宽度
    getMaxLength(arr) {
      console.log(arr);
      return arr.reduce((acc, item) => {
        if (item) {
          let calcLen = this.getTextWidth(item);
          if (acc < calcLen) {
            acc = calcLen;
          }
        }
        return acc;
      }, 0);
    },
    //使用span标签包裹内容，然后计算span的宽度 width： px
    getTextWidth(str) {
      let width = 0;
      let html = document.createElement("span");
      html.innerText = str;
      html.className = "getTextWidth";
      document.querySelector("body").appendChild(html);
      width = document.querySelector(".getTextWidth").offsetWidth;
      document.querySelector(".getTextWidth").remove();
      return width;
    },
    // 表格勾选
    select(rows, row) {
      this.$emit("selectid", rows, row);
    },
    // 全选
    selectAll(rows) {
      this.$emit("select", rows);
    },
    isColSupportSort(colName) {
      return colName === "id" || colName === "time" || colName === "name";
    },
    editRow(row) {
      this.$emit("editRow", row);
      console.log("点击了编辑", row);
    },
    detailRow(row) {
      this.$emit("detailRow", row);
      console.log("点击了查看", row);
    },
    arrIncludes(arr, item) {
      return arr.includes(item);
    },
    handleButton(item, itemx) {
      this.$emit("optClick", item, itemx);
    },

    searchTask() {
      this.pagination.pageNum = 1;
      this.$emit("refresh");
      this.$emit("search", this.searchData);
    },
    handleCurrentChange(val) {
      this.pagination.pageNum = val;
      this.$emit("refresh");
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.$emit("refresh");
    }
  }
};
</script>

<style lang="scss" scoped>
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
  .el-main {
    overflow: hidden !important;
  }
}
</style>
