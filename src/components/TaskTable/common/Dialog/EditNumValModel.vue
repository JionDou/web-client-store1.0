<template>
  <!--任务模板库：编辑任务 -->
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    :rules="rules"
    label-position="right"
    label-width="120px"
  >
    <el-form-item label="配置模板类型">
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
      <el-input
        v-model="ruleForm.name"
        placeholder
        style="width:60%;"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item
      v-for="(item, index) in common"
      :key="index"
      :label="item.title"
      :align="item.align ? item.align : 'left'"
      required
      class="commonStyle"
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
        v-if="item.id === 'taskid'"
        v-model="item.default"
        disabled
        type="number"
        style="width:60%;"
      >
      </el-input>
      <el-input
        v-if="item.val_type === 'number' && item.id !== 'taskid'"
        v-model="item.default"
        type="number"
        style="width:60%;"
      ></el-input>
      <el-input
        v-if="item.cfg_type === 'text' && item.val_type !== 'number'"
        v-model="item.default"
        type="input"
        @input="val => $emit('input', val)"
        style="width:60%;"
      ></el-input>
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
        ></el-option>
      </el-select>

      <el-date-picker
        v-else-if="item.cfg_type === 'range'"
        v-model.number="item.format"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
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
        ></el-option>
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
            class="paneLabel"
            style="margin-top:20px;"
          >
            <template>
              <el-checkbox-group
                v-model="item.isSelected"
                style="display: inline;margin-right:26px;"
              >
                <el-checkbox label></el-checkbox>
              </el-checkbox-group>
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
                placement="top"
              >
                <i
                  class="el-icon-question"
                  style="font-size:19px;margin-right:10px;position: relative;top: 2px;"
                ></i>
              </el-tooltip>
            </template>

            <el-input
              v-if="item.val_type === 'number'"
              v-model="item.default"
              type="number"
              clearable
              :placeholder="item.placeholder"
              style="width:75%;"
            ></el-input>
            <el-input
              v-if="item.val_type === 'string'"
              v-model="item.default"
              type="input"
              clearable
              :placeholder="item.placeholder"
              style="width:75%;"
            ></el-input>
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
              style="width:75%"
            >
              <el-option
                v-for="item in item.enum"
                :key="item.id"
                :label="item.desc"
                :value="item.val"
              ></el-option>
            </el-select>
            <!-- 完成任务条件 -->
            <el-row style="margin-left: -90px;">
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
                    style="width:72%;margin-bottom:6px;"
                  ></el-input>
                  <el-input
                    v-if="item.val_type === 'string'"
                    v-model="item.default"
                    type="input"
                    clearable
                    :placeholder="item.placeholder"
                    style="width:72%;margin-bottom:6px;"
                  ></el-input>
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
        <div class="routeManagement" v-if="item.val_type === 'json'">
          <vue-json-editor v-model="item.default" :showBtns="false" lang="zh" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      width="30%"
      title="comment"
      :visible.sync="innerVisible"
      append-to-body
    >
      <el-input
        v-model="ruleForm.comment"
        type="textarea"
        placeholder
      ></el-input>
      <el-row>
        <el-col
          :span="24"
          style="display: flex;align-items: center;justify-content: flex-end;margin-top: 10px;"
        >
          <el-button type="success" @click="onSure" size="mini">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-row>
      <el-col :span="24">
        <el-button
          v-if="isSubmitVisble"
          type="success"
          @click="onSubmit"
          :loading="loading"
          plain
          size="medium"
          style="float:right;margin-right:20px;margin-bottom:20px;"
          >提交</el-button
        >
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import {
  getModelFromData,
  commitNumValModel,
  getNumValModel
} from "@/api/task";
import vueJsonEditor from "vue-json-editor";
export default {
  name: "EditNumValModel",
  components: { vueJsonEditor },
  props: { id: String },
  data() {
    return {
      isSubmitVisble: true,
      loading: false,
      innerVisible: false,
      activeNames: 0,
      tabPosition: "left",
      activeName: "universe",
      ruleForm: {
        tmpl: {
          common: {},
          pages: {}
        },
        name: "",
        desc: "",
        comment: "",
        version: ""
      },
      common: [], //任务列表公共部分数据
      pages: [],
      properties: [], //任务列表pages里的properties数据
      rules: {}
    };
  },
  watch: {
    id(val) {
      this.getEditTaskById(this.id);
    }
  },
  mounted() {
    this.getModelFromData();
    this.getEditTaskById(this.id);
  },
  methods: {
    handleClick(tab) {
      this.currentTabComponent = tab.paneName;
    },
    clickCircle(item) {
      item.isTag = !item.isTag;
    },

    async getModelFromData() {
      //获取端游数值模板列表数据
      this.loading = true;
      const res = await getModelFromData();
      if (res.code === 200 || res.code === 201) {
        let schemaData = res.data.schema_info;
        this.common = schemaData.common.properties;
        this.pages = schemaData.pages;

        this.pages.forEach(x => {
          if (x.cfg_type === "object") {
            x.properties.forEach(property => {
              this.$set(property, "isSelected", false);
              this.$set(property, "isTag", false);
            });
          }
        });
        this.loading = false;
      }
    },
    //获取编辑任务id
    async getEditTaskById(id) {
      console.log(id);
      const res = await getNumValModel(id);
      try {
        if (res.code === 200 || res.code === 201) {
          let taskData = res.data.content;
          this.ruleForm.name = res.data.meta_data.name;
          this.ruleForm.version = res.data.meta_data.version;
          this.common.forEach(y => {
            let id = y.id;
            y.default = taskData.common[id];
          });
          this.pages.forEach(x => {
            let page_id = x.id;
            if (page_id === "other") {
              x.default = taskData.pages[page_id];
            }
            if (x.properties) {
              x.properties.forEach(y => {
                // 模板数据接口遍历
                let prop_id = y.id;
                if (y.cfg_type === "object") {
                  y.properties.forEach(z => {
                    let prop_child_id = z.id;
                    console.log(`${prop_child_id},${z.default}`);
                    z.default = taskData.pages[page_id][prop_id][prop_child_id];
                    z.default = z.default["default"];
                  });
                }
                // if (y.val_type === "json") {
                //   y.default = taskData.pages[page_id][prop_id];
                // } else {
                //   y.default = taskData.pages[page_id][prop_id];
                //   y.default = y.default["default"];
                // }
                if (
                  taskData.pages[page_id] &&
                  taskData.pages[page_id][prop_id]
                ) {
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
      } catch (error) {}
    },
    beforeSubmit() {
      this.common.forEach(x => {
        let id = x.id;
        this.ruleForm.tmpl.common[id] = x.default;
      });

      this.pages.forEach(page => {
        if (page.cfg_type === "object") {
          page.properties.forEach(x => {
            if (x.isSelected) {
              if (!this.ruleForm.tmpl.pages[page.id]) {
                this.ruleForm.tmpl.pages[page.id] = {};
              }
              this.ruleForm.tmpl.pages[page.id][x.id] = {};
              if (x.isSelected) {
                this.ruleForm.tmpl.pages[page.id][x.id].default = x.default;
              }
              if (x.isTag) {
                this.ruleForm.tmpl.pages[page.id][x.id].tag = "POINT";
              }
            }
          });
        }
      });
    },
    onSubmit() {
      this.innerVisible = true;
    },
    async onSure() {
      this.beforeSubmit();
      let id = this.common[0].default;
      let params = this.ruleForm;

      try {
        const res = await commitNumValModel(id, params);
        if (res.code === 200 || res.code === 201) {
          this.$message({
            type: "success",
            message: "提交成功！"
          });
          this.innerVisible = false;
          this.$emit("closeDialog");
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: "提交失败！"
        });
        this.innerVisible = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.routeManagement {
  width: 98%;
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
    margin-left: 26px;
    width: 60%;
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
    margin-left: 26px;
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
  margin-left: 52px;
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
