<template>
  <!-- 任务配置：新增任务 -->
  <el-form :model="ruleForm" label-position="right" label-width="120px">
    <el-row class="modelSelectStyle">
      <el-col :span="24">
        <el-form-item label="任务类型">
          <el-tooltip
            class="item"
            effect="light"
            :content="ruleForm.desc"
            placement="left-end"
          >
            <i
              class="el-icon-warning-outline"
              style="font-size:18px;margin-right:10px;"
            ></i>
          </el-tooltip>
          <el-select
            v-model="ruleForm.cfg_tmpl_id"
            placeholder="请选择"
            style="width:60%;"
            @change="getByType"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      v-for="(item, index) in common"
      :key="index"
      :label="item.title"
      :align="item.align ? item.align : 'left'"
      required
    >
      <el-tooltip
        class="item"
        effect="light"
        :content="item.desc"
        placement="left-end"
      >
        <i
          class="el-icon-warning-outline"
          style="font-size:18px;margin-right:10px;"
        ></i>
      </el-tooltip>
      <el-input
        v-if="item.val_type === 'number'"
        v-model="item.default"
        type="number"
        style="width:60%;"
      >
      </el-input>
      <el-input
        v-if="item.cfg_type === 'text' && item.val_type !== 'number'"
        v-model="item.default"
        type="input"
        @input="val => $emit('input', val)"
        style="width:60%;"
      >
      </el-input>
      <el-select
        v-model="item.default"
        placeholder="请选择"
        v-if="item.cfg_type === 'single_select'"
        style="width:60%;"
      >
        <el-option
          v-for="item in item.enum"
          :key="item.id"
          :label="item.desc"
          :value="item.val"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-else-if="item.cfg_type === 'range'"
        v-model.number="item.format"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <el-select
        v-model="multi_select"
        v-else-if="item.cfg_type === 'multi_select'"
        multiple
        placeholder="请选择"
      >
        <el-option
          v-for="o in item.enum"
          :key="o.id"
          :label="o.desc"
          :value="o.val"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="card"
      style="margin-left: 16px;"
      :tab-position="tabPosition"
    >
      <el-tab-pane
        v-for="(item, index) in this.pages"
        :key="index"
        :label="item.title"
        :name="item.id"
      >
        <template v-if="item.cfg_type !== 'json'">
          <el-form-item
            v-for="(item, i) in item.properties"
            :key="i"
            :label="item.title"
            style="margin-top:20px;"
            class="paneLabel"
          >
            <el-button
              size="mini"
              style="width:6px;height:6px;position:relative;top: -5px;left: -11px;"
              circle
              :type="item.isTag == true ? 'danger' : ''"
              @click="clickCircle(item)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.desc"
              placement="left-end"
            >
              <i
                class="el-icon-warning-outline"
                style="font-size:16px;margin-right:10px;"
              ></i>
            </el-tooltip>
            <el-input
              v-if="item.val_type === 'number'"
              v-model="item.default"
              type="number"
              clearable
              :placeholder="item.placeholder"
              style="width:70%;"
            >
            </el-input>
            <el-input
              v-if="item.val_type === 'string'"
              v-model="item.default"
              type="input"
              clearable
              :placeholder="item.placeholder"
              style="width:70%;"
            >
            </el-input>
            <el-input
              v-if="item.val_type === 'refer' && item.cfg_type === 'text'"
              v-model="item.default"
              type="input"
              clearable
              :placeholder="item.placeholder"
              style="width:75%;"
            ></el-input>
            <el-select
              v-model="item.default"
              placeholder="请选择"
              v-if="item.cfg_type === 'single_select'"
              style="width:70%;"
            >
              <el-option
                v-for="item in item.enum"
                :key="item.id"
                :label="item.desc"
                :value="item.val"
              >
              </el-option>
            </el-select>
            <!-- 完成任务条件 -->
            <el-row style="margin-left:-90px;">
              <el-col :span="24">
                <el-form-item
                  v-for="(item, i) in item.properties"
                  :key="i"
                  :label="item.title"
                  class="finish"
                >
                  <el-input
                    v-if="item.val_type === 'number'"
                    v-model="item.default"
                    type="number"
                    clearable
                    :placeholder="item.placeholder"
                    style="width:60%;margin-bottom:8px;"
                  >
                  </el-input>
                  <el-input
                    v-if="item.val_type === 'string'"
                    v-model="item.default"
                    type="input"
                    clearable
                    :placeholder="item.placeholder"
                    style="width:60%;margin-bottom:8px;"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 完成任务条件end -->
            <div
              class="routeManagement"
              v-if="item.val_type === 'json'"
              style="position: relative;top: -23px;"
            >
              <vue-json-editor
                v-model="item.default"
                :showBtns="false"
                lang="zh"
              />
            </div>
          </el-form-item>
        </template>
        <!-- 其他 -->
        <div class="routeManagement" v-if="item.val_type === 'json'">
          <vue-json-editor v-model="item.default" :showBtns="false" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-row>
      <el-col :span="24">
        <el-button
          v-if="isSubmitVisble"
          type="success"
          @click="onSubmit"
          :loading="loading"
          plain
          style="float:right;margin-right:20px;margin-bottom:20px;"
          >提交</el-button
        >
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getSchema, createSchemaById, editCfgTmplById } from "@/api/m-Activity";
import { getCfgTmplList } from "@/api/mShowType";
import vueJsonEditor from "vue-json-editor";
export default {
  name: "AddCfgSchmea",
  props: {
    name: String,
    option: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    tabsData: function() {
      return this.option.pages || [];
    }
  },
  components: { vueJsonEditor },
  data() {
    return {
      isSubmitVisble: true,
      loading: false,
      tabPosition: "left",
      activeName: "universe",
      activeNames: 0,
      options: [],
      ruleForm: {
        content: {
          common: {},
          pages: {
            universe: {},
            logic: {},
            special: {},
            award: {},
            other: {}
          }
        },
        cfg_tmpl_id: ""
      },
      common: [], //任务列表公共部分数据
      pages: [],
      properties: [], //任务列表pages里的properties数据
      rules: {}
    };
  },
  mounted() {
    this.getCfgTmplList();
    this.getSchema();
  },
  methods: {
    handleClick(tab) {
      this.currentTabComponent = tab.paneName;
    },
    clickCircle(item) {
      item.isTag = !item.isTag;
    },
    async getByType() {
      let id = this.ruleForm.cfg_tmpl_id;
      const res = await editCfgTmplById(id);
      let taskData = res.data.content;
      if (res.code === 200 || res.code === 201) {
        this.pages.forEach(x => {
          let page_id = x.id;
          if (Array.isArray(x.properties)) {
            x.properties.forEach(y => {
              // 模板数据接口遍历
              let prop_id = y.id;
              if (y.cfg_type === "object") {
                y.properties.forEach(z => {
                  let prop_child_id = z.id;
                  // z.default = taskData.pages[page_id][prop_id][prop_child_id];
                  // z.default = z.default["default"];
                });
              }
              if (taskData.pages[page_id] && taskData.pages[page_id][prop_id]) {
                if (taskData.pages[page_id][prop_id]["default"]) {
                  y.default = taskData.pages[page_id][prop_id]["default"];
                  y.isSelected = true;
                }
                if (taskData.pages[page_id][prop_id]["tag"]) {
                  y.isTag = true;
                }
              }
            });
          }
        });
      }
    },
    //获取端游任务配置表单模板数据
    async getSchema() {
      let activity = this.$route.meta.activity;
      const res = await getSchema(activity);
      let schemaData = res.data.schema_info;
      this.common = schemaData.common.properties;
      this.pages = schemaData.pages;
    },
    //获取端游任务类型选择数据
    async getCfgTmplList() {
      this.loading = true;
      const res = await getCfgTmplList();
      if (res.code === 200 || res.code === 201) {
        this.tableData = res.data.content.items;
        this.tableData.forEach(x => {
          this.options.push({
            id: x.id,
            name: x.name
          });
        });
        this.loading = false;
      }
    },
    beforeSubmit() {
      if (!this.ruleForm.content) {
        this.ruleForm.content = {};
      }
      if (!this.ruleForm.content.common) {
        this.ruleForm.content.common = {};
      }
      this.common.forEach(x => {
        let id = x.id;
        this.ruleForm.content.common[id] = x.default;
      });
      this.pages.forEach(page => {
        let page_id = page.id;
        if (Array.isArray(page.properties)) {
          page.properties.forEach(prop => {
            let prop_id = prop.id;
            if (prop.cfg_type === "object") {
              prop.properties.forEach(childprop => {
                let child_prop_id = childprop.id;
                if (!this.ruleForm.content.pages[page_id][prop_id]) {
                  this.ruleForm.content.pages[page_id][prop_id] = {};
                }
                this.ruleForm.content.pages[page_id][prop_id][child_prop_id] =
                  childprop.default;
              });
            } else {
              if (page.val_type == "json") {
                this.ruleForm.content.pages[page_id][prop_id] = prop.default;
              } else {
                this.ruleForm.content.pages[page_id][prop_id] = prop.default;
                // prop.default = prop.default["default"];
              }
            }
          });
        } else {
          if (page.val_type == "json") {
            this.ruleForm.content.pages[page_id] = page.default;
          } else {
            this.ruleForm.content.pages[page_id] = page.default;
            page.default = page.default["default"];
          }
        }
      });
    },
    async onSubmit() {
      let id = this.common[2].default;
      this.beforeSubmit();
      this.loading = true;
      let type = this.$route.meta.type;
      let activity = this.$route.meta.activity;
      let params = JSON.parse(JSON.stringify(this.ruleForm));
      if (type === "cfg") {
        const res = await createSchemaById(activity, id, params);
        if (res.code === 200 || res.code === 201) {
          this.$message({
            type: "success",
            message: "提交成功！"
          });
          this.loading = false;
          this.$emit("closeDialog", "refresh");
        }
      } else if (type === "cfg-tmpl") {
        let id = this.common[1].default;
        console.log(id);
        const res = await createCfgTmplById(activity, id, params);
        if (res.code === 200 || res.code === 201) {
          this.$message({
            type: "success",
            message: "提交成功！"
          });
          this.loading = false;
          this.$emit("closeDialog", "refresh");
        }
      }
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
.routeManagement {
  width: 95%;
  margin: 16px auto;
  white-space: nowrap;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;
  ::v-deep {
    .jsoneditor {
      // height: 700px;
      min-height: 200px;
      border-color: transparent;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 6px;
      box-shadow: 0 2px 7px rgba(0, 0, 0, 0.15);
    }
    .json-save-btn {
      cursor: pointer;
    }
    .jsoneditor-menu {
      background: #999;
      color: #525252;
      border: 1px solid #eee;
    }
  }
}
.modelSelectStyle {
  background-color: #f3f3f3;
  width: 100%;
  height: 60px;
  .el-col {
    padding: 10px 0 10px 0;
  }
  .el-select {
    width: 60%;
  }
}
.paneLabel {
  ::v-deep {
    .el-form-item__label {
      width: 130px !important;
    }
  }
}
.finish {
  ::v-deep {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
::v-deep {
  .el-collapse-item__header {
    background-color: #f3f3f3;
    border-bottom: 1px solid #efefef;
  }
  .el-collapse-item__content {
    margin-top: 6px;
    margin-bottom: 20px;
  }
  .el-collapse-item__wrap {
    background-color: #ddd;
    border-bottom: 1px solid #efefef;
  }
  .el-collapse {
    margin-top: 15px;
    border-top: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
  }
}
::v-deep .el-dialog__title {
  float: left !important;
}

::v-deep .el-form-item--medium .el-form-item__label {
  // width: 20%;
  margin-right: 15px;
  font-size: 15px;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background: #8184fc;
  color: #fff;
  border-radius: 2px;
}
::v-deep .el-tabs__content {
  background: #ddd;
  position: relative;
  top: -15px;
}
::v-deep .el-input--medium .el-input__inner {
  width: 389px;
}
</style>
