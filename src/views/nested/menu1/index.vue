<template>
  <!-- 任务模板库 -->
  <section class="ces-table-page modelContainer">
    <section class="ces-dialog ">
      <component
        :is="activtyManagerDialog.name"
        ref="activtyManagerDialog"
      ></component>
    </section>
    <!-- end 弹窗组件 -->

    <!-- 表格动态组件 -->
    <section class="ces-table" v-if="showType === 0">
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
        :tableFootHandles="tableFootHandles"
        :pagination="pagination"
        @refresh="refresh"
        @search="search"
        @optClick="handleOptClick"
      ></component>
    </section>
    <section class="ces-module" v-else-if="showType === 1">
      <component :is="module.name" ref="module"></component>
    </section>
    <section class="ces-custom-template" v-else-if="showType === 2">
      <component :is="customTemplate.name" ref="customTemplate"></component>
    </section>
  </section>
</template>

<script>
import CustomTemplate from "@/components/Custom-template/Custom-template";
import TableList from "@/components/TableList/TableList";
import Module from "@/components/Activty-Manager/module/Module";
import { getCfgList, getCfgTmplList } from "@/api/mShowType";
import ActivtyManagerDialog from "@/components/Activty-Manager/Activty-Manager-Dialog.vue";
export default {
  components: {
    ActivtyManagerDialog,
    TableList,
    Module,
    CustomTemplate
  },
  data() {
    return {
      loading: false,
      taskCfgData: {
        name: "TableList"
      },
      module: {
        name: "Module"
      },
      customTemplate: {
        name: "CustomTemplate"
      },
      activtyManagerDialog: {
        name: "activtyManagerDialog"
      },
      showType: 0,
      tableAllData: [],
      tableSearchData: [],
      tableData: [],
      tableCols: [],
      optionsArr: ["edit", "detail"],
      searchData: {},
      schemaData: {},
      schemaForm: [],
      schemaHandle: [],
      tableHandles: [],
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
    this.getListAll();
    this.tableMenu();
  },
  methods: {
    tableMenu() {
      let type = this.$route.meta.type;
      if (type === "cfg") {
        this.tableHandles.push({
          label: "新增任务",
          type: "warning",
          handle: () => {
            console.log("点击了新增任务");
            this.isTag = false;
            this.$refs.activtyManagerDialog.addSchema();
          }
        });
      } else if (type === "cfg-tmpl") {
        this.tableHandles.push(
          {
            label: "编辑表单模板",
            type: "success",
            handle: () => {
              console.log("点击了编辑表单模板");
              this.$refs.activtyManagerDialog.customTemplate();
            }
          },
          {
            label: "新增数值模板",
            type: "warning",
            handle: () => {
              console.log("点击了新增数值模板");
              this.$refs.activtyManagerDialog.cfgTmpl();
            }
          }
        );
      } else if (type === "record") {
        this.tableHandles.push({
          label: "下架记录",
          type: "success",
          handle: () => {
            console.log("点击了下架记录");
          }
        });
      }
    },
    async getListAll() {
      let type = this.$route.meta.type;
      let showtype = this.$route.meta.showtype;
      let activity = this.$route.meta.activity;
      if (type === "cfg" && showtype === "list") {
        this.loading = true;
        let res = await getCfgList(activity);
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
            message: "加载失败！"
          });
          this.loading = false;
        }
      } else if (type === "cfg-tmpl") {
        this.loading = true;
        let res = await getCfgTmplList(activity);
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
            message: "加载失败！"
          });
          this.loading = false;
        }
      } else if (type === "schema") {
        this.showType = 2;
      } else if (showtype === "module") {
        this.showType = 1;
      }
    },
    handleOptClick(item, itemx) {
      console.log("handleOptClick", item.id);
      let id = item.id;
      let type = this.$route.meta.type;
      if (itemx.prop === "edit") {
        if (type === "cfg") {
          this.$emit("getById");
          this.$refs.activtyManagerDialog.editSchema(id);
        } else if (type === "cfg-tmpl") {
          this.$emit("getById");
          this.$refs.activtyManagerDialog.editCfgTmpl(id);
        }
      } else if (itemx.prop === "view") {
        if (type === "cfg") {
          this.$refs.activtyManagerDialog.viewSchema(id);
        } else if (type === "cfg-tmpl") {
          this.$refs.activtyManagerDialog.viewCfgTmpl(id);
        }
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
        this.tableSearchData = this.tableAllData.filter(function(item) {
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
    //点击当前页
    handleCurrentChange(val) {
      this.pagination.pageNum = val;
      this.refresh();
    },
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.refresh();
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
.modelContainer {
  width: 100%;
  border: 1px solid #ddd;
  padding: 20px 12px 150px 12px;
  border-radius: 4px;
  background: #e8f4ff;
  margin-top: 10px;
}
</style>
