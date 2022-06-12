<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    :rules="rules"
    label-position="right"
    label-width="120px"
  >
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
        v-if="item.val_type === 'number'"
        v-model="item.default"
        type="number"
        style="width:60%;"
      ></el-input>
      <el-input
        v-if="item.cfg_type === 'text'"
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
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="(property, i) in item.properties"
            :key="i"
            :name="i"
            class="collItemStyle"
          >
            <template slot="title">
              <div
                style="margin-left:20px;border:1px solid #333;line-height:26px;text-align:center;border-radius: 2px;width:93%;"
              >
                数组元素： 展开/收缩
              </div>
            </template>
            <el-form-item
              v-for="(item, i) in property"
              :key="i"
              :label="item.title"
              class="paneLabel"
              style="margin-top:20px;"
            >
              <el-checkbox-group
                v-model="checkList"
                style="display: inline;margin-right:26px;"
              >
                <el-checkbox label></el-checkbox>
              </el-checkbox-group>
              <el-button
                size="mini"
                style="width:6px;height:6px;position:relative;top: -5px;left: -11px;"
                circle
                :type="isActive ? 'danger' : ''"
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
                      style="width:45%;margin-bottom:6px;"
                    ></el-input>
                    <el-input
                      v-if="item.val_type === 'string'"
                      v-model="item.default"
                      type="input"
                      clearable
                      :placeholder="item.placeholder"
                      style="width:45%;margin-bottom:6px;"
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
                  @json-change="onJsonChange"
                  @json-save="onJsonSave"
                />
              </div>
              <!-- <el-input
                v-if="item.val_type === 'json'"
                v-model="item.default"
                type="textarea"
                clearable
                style="width:100%;"
              >
              </el-input>-->
            </el-form-item>
            <div class="routeManagement" v-if="item.val_type === 'json'">
              <vue-json-editor
                v-model="item.default"
                :showBtns="false"
                lang="zh"
                @json-change="onJsonChange"
                @json-save="onJsonSave"
              />
            </div>
          </el-collapse-item>
        </el-collapse>
        <div
          style="text-align:right;width:100%;padding-right:16px;background:#f3f3f3;"
        >
          <el-tooltip
            class="item"
            effect="light"
            content="添加新组件"
            placement="top"
          >
            <el-button
              type="text"
              @click="addList(index)"
              style="font-size: 30px;"
            >
              <i class="el-icon-circle-plus"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="light"
            content="删除组件"
            placement="top"
          >
            <el-button
              type="text"
              @click="deleteList(index)"
              style="font-size: 30px;"
            >
              <i class="el-icon-remove"></i>
            </el-button>
          </el-tooltip>
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
import { getModelFromData, createNumValModel } from "@/api/task";
import vueJsonEditor from "vue-json-editor";
export default {
  name: "AddNumValModel",
  components: { vueJsonEditor },
  data() {
    return {
      rotate: false,
      checkAll: false,
      isIndeterminate: true,
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
        content: {
          common: {},
          pages: {}
        },
        name: "累计登录任务",
        desc: "累计登录任务 desc",
        comment: ""
      },
      common: [], //任务列表公共部分数据
      pages: [],
      properties: [], //任务列表pages里的properties数据
      rules: {
        common: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      typeSelect: [
        {
          id: "1",
          val: "login_task",
          desc: "登录任务"
        },
        {
          id: "2",
          val: "run_plan_task",
          desc: "跑图任务"
        },
        {
          id: "3",
          val: "count_login_task",
          desc: "累计登录任务"
        }
      ]
    };
  },
  watch: {},
  mounted() {
    this.getModelFromData();
  },
  methods: {
    handleClick(tab) {
      this.currentTabComponent = tab.paneName;
    },
    activeCollapse() {
      this.rotate = !this.rotate;
    },
    clickCircle(isActive) {
      this.isActive = !this.isActive;
    },
    onJsonChange() {},
    onJsonSave() {},
    addList(index) {
      console.log("addListCard Click " + index);
      console.log("添加新组件");
      let newItem = JSON.parse(JSON.stringify(this.pages[index].properties[0]));
      newItem.forEach(item => (item.default = ""));
      this.pages[index].properties.push(newItem);
      this.activeNames = this.pages[index].properties.length - 1;
    },
    deleteList(index) {
      console.log("删除新组件");
      console.log("deleteList Click " + index);
      let properties = this.pages[index].properties;
      if (properties.length <= 1) {
        return;
      }
      properties.pop(properties[properties.length - 1]);
    },
    async getModelFromData() {
      //获取端游模板数据
      this.loading = true;
      const res = await getModelFromData();
      if (res.code === 200 || res.code === 201) {
        let schemaData = res.data.schema_info;
        this.common = schemaData.common.properties;
        this.pages = schemaData.pages;
        this.pages.forEach(x => {
          let properties = x.properties;
          x.properties = [];
          x.properties.push(properties);
        });
        this.loading = false;
      }
    },
    beforeSubmit() {
      this.common.forEach(x => {
        let id = x.id;
        this.ruleForm.content.common[id] = x.default;
      });
      this.pages.forEach(page => {
        if (page.cfg_type === "object") {
          let obj = [];
          page.properties.forEach(x => {
            let mPage = {};
            x.forEach(element => {
              mPage[element.id] = element.default;
            });
            obj.push(mPage);
          });
          this.ruleForm.content.pages[page.id] = obj;
        }
      });
    },
    onSubmit() {
      this.innerVisible = true;
    },
    async onSure() {
      console.log("点击了提交");
      console.log(this.common[0].default);
      this.beforeSubmit();
      let id = this.common[0].default;
      let params = {
        data: this.ruleForm
      };
      try {
        const res = await createNumValModel(id, params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "提交成功！"
          });
          this.innerVisible = false;
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
