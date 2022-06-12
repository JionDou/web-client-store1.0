<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-position="right"
    label-width="120px"
    :disabled="disabled"
  >
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
        v-if="item.val_type === 'number'"
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
        <el-form-item
          v-for="(item, i) in item.properties"
          :key="i"
          :label="item.title"
          class="paneLabel"
          style="margin-top:20px;"
        >
          <template v-if="isTag">
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
              :type="item.isTag ? 'danger' : ''"
              @click="clickCircle(item)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.desc"
              placement="left-end"
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
                  v-if="item.cfg_type === 'text'"
                  v-model="item.default"
                  type="text"
                  clearable
                  :placeholder="item.placeholder"
                  style="width:72.5%;margin-bottom:6px;"
                ></el-input>
                <el-input
                  v-if="item.val_type === 'string'"
                  v-model="item.default"
                  type="input"
                  clearable
                  :placeholder="item.placeholder"
                  style="width:72.5%;margin-bottom:6px;"
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
  getSchema,
  createCfgTmplById,
  editCfgTmplById,
  viewCfgTmplById
} from "@/api/m-Activity";
import vueJsonEditor from "vue-json-editor";
export default {
  name: "CfgTmpl",
  components: { vueJsonEditor },
  props: {
    isTag: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      isSubmitVisble: true,
      loading: false,
      innerVisible: false,
      isActive: false,
      activeNames: 0,
      tabPosition: "left",
      activeName: "universe",
      modelSelect: "",
      checkList: [],
      ruleForm: {
        tmpl: {
          common: {},
          pages: {}
        },
        name: "",
        desc: "",
        comment: "",
        id: ""
      },
      common: [], //任务列表公共部分数据
      pages: [],
      properties: [] //任务列表pages里的properties数据
    };
  },
  watch: {},
  mounted() {
    this.getSchema();
  },
  methods: {
    handleClick(tab) {
      this.currentTabComponent = tab.paneName;
    },
    clickCircle(item) {
      item.isTag = !item.isTag;
    },
    //获取模板数据
    async getSchema() {
      this.loading = true;
      let activity = this.$route.meta.activity;
      try {
        const res = await getSchema(activity);
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
      } catch (error) {}
    },
    //通过id获取模板数据
    async getById(id) {
      let activity = this.$route.meta.activity;
      const res = await editCfgTmplById(activity, id);
      try {
        if (res.code === 200 || res.code === 201) {
          this.ruleForm.ver_ctrl_info.common.path =
            res.data.ver_ctrl_info.common.path;
          this.ruleForm.ver_ctrl_info.common.brand =
            res.data.ver_ctrl_info.common.brand;
          this.ruleForm.ver_ctrl_info.common.version =
            res.data.ver_ctrl_info.common.version;

          let taskData = res.data.content;
          this.common.forEach(y => {
            let id = y.id;
            y.default = taskData.common[id];
          });
          this.pages.forEach(x => {
            let page_id = x.id;
            x.default = taskData.pages[page_id];
            if (x.properties) {
              x.properties.forEach(y => {
                // 模板数据接口遍历
                let prop_id = y.id;
                if (y.cfg_type === "object") {
                  y.properties.forEach(z => {
                    let prop_child_id = z.id;
                    z.default = taskData.pages[page_id][prop_id][prop_child_id];
                  });
                }
                if (y.val_type === "json") {
                  y.default = taskData.pages[page_id][prop_id];
                } else {
                  y.default = taskData.pages[page_id][prop_id];
                }
              });
            }
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: res.message
        });
      }
    },
    beforeSubmit() {
      this.common.forEach(x => {
        let id = x.id;
        this.ruleForm.tmpl.common[id] = x.default;
      });
      console.log("start.");
      this.pages.forEach(page => {
        if (page.cfg_type === "object") {
          page.properties.forEach(x => {
            if (x.isSelected || x.isTag) {
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
              // this.ruleForm.content.pages[page.id][x.id].desc = x.desc;
            }
          });
        }
      });
      console.log(this.ruleForm);
    },
    onSubmit() {
      this.innerVisible = true;
    },
    async onSure() {
      console.log("点击了提交");
      console.log(this.common[0].default);
      this.beforeSubmit();
      let id = this.common[0].default;
      let params = this.ruleForm;

      try {
        const res = await createCfgTmplById(id, params);
        if (res.code === 200) {
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
