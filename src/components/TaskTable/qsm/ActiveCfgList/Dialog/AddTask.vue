<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    :rules="rules"
    label-position="left"
    label-width="120px"
  >
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
        v-if="item.val_type === 'string'"
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
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item
            v-for="(property, i) in item.items.properties"
            :key="i"
            :name="i"
            class="paneLabel"
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
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.desc"
                placement="left-end"
                style="margin-left:20px;"
              >
                <i
                  class="el-icon-question"
                  style="font-size:16px;margin-right:10px;"
                ></i>
              </el-tooltip>
              <el-input
                v-if="item.val_type === 'number'"
                v-model="item.default"
                type="number"
                clearable
                :placeholder="item.placeholder"
                style="width:65%;"
              >
              </el-input>
              <el-input
                v-model="item.default"
                type="input"
                clearable
                :placeholder="item.placeholder"
                style="width:65%;"
              >
              </el-input>
              <el-select
                v-model="item.default"
                placeholder="请选择"
                v-if="item.cfg_type === 'single_select'"
              >
                <el-option
                  v-for="item in item.enum"
                  :key="item.id"
                  :label="item.desc"
                  :value="item.val"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <div
          style="text-align:right;width:100%;margin-top:10px;padding-right: 16px;"
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
    <el-row>
      <el-col :span="24">
        <el-button
          v-if="isSubmitVisble"
          type="success"
          @click="onSubmit"
          :loading="loading"
          plain
          style="float: right;margin-right:20px"
        >
          提交
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import axios from "axios";
import { getMobileTaskModelData } from "@/api/task";
export default {
  name: "AddTask",
  props: ["dialog.visible"],
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      isSubmitVisble: true,
      loading: false,

      activeNames: 0, //折叠面板
      radio: "1",
      tabPosition: "left",
      activeName: "AVehicleFreeExperienceCommonCfg",
      ruleForm: {
        content: {
          common: {},
          pages: {}
        }
      },
      common: [], //任务列表公共部分数据
      pages: [],
      properties: [], //任务列表pages里的properties数据
      rules: {
        common: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    visible(newValue, oldValue) {
      this.visible = newValue;
    }
  },
  mounted() {
    this.createMobileTask();
  },
  methods: {
    handleClick(tab) {
      this.currentTabComponent = tab.paneName;
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false;
    },
    addList(index) {
      console.log("addListCard Click " + index);
      console.log("添加新组件");
      let newItem = JSON.parse(
        JSON.stringify(this.pages[index].items.properties[0])
      );
      newItem.forEach(item => (item.default = ""));
      this.pages[index].items.properties.push(newItem);
      this.activeNames = this.pages[index].items.properties.length - 1;
    },
    deleteList(index) {
      console.log("删除新组件");
      console.log("deleteList Click " + index);
      let properties = this.pages[index].items.properties;
      if (properties.length <= 1) {
        return;
      }
      properties.pop(properties[properties.length - 1]);
    },
    async createMobileTask() {
      //获取手游模板数据
      this.loading = true;
      let params = {
        branch: "trunk"
      };
      const res = await getMobileTaskModelData(params);
      if (res.code === 200 || res.code === 201) {
        let schemaData = res.data.schema_info;
        this.pages = schemaData.pages;
        this.pages.forEach(x => {
          x.title = x.title.split("-")[1];
          let properties = x.items.properties;
          x.items.properties = [];
          x.items.properties.push(properties);
        });
        this.loading = false;
        console.log(this.pages);
      }
    },
    onSubmit() {
      this.$router.push("/HistoryRecord");

      axios
        .get(
          "http://10.32.96.61:3457/qsm/data/AVehicleFreeExperience/2?branch=trunk"
        )
        .then(res => {
          this.pages.forEach(page => {
            this.$set(
              res.data.data.content.pages,
              page.id,
              this.convert(page.items.properties)
            );
          });
          console.log(JSON.stringify(res.data.data));

          let params = {
            server: 30,
            data: res.data.data
          };
          axios
            .post(
              "http://10.32.96.61:3457/qsm/data/AVehicleFreeExperience/3?branch=trunk",
              params
            )
            .then(res => {
              // if (res.data.code === 200 || res.data.code === 201) {
              //   this.$message({
              //     type: "success",
              //     message: "提交成功！"
              //   });
              //   this.loading = false;
              //   // this.$emit("update:dialog.visible", false);
              //   this.$refs.dialog.$emit("visible", false);
              // } else {
              //   this.$message({
              //     type: "error",
              //     message: res.data.message
              //   });
              //   this.loading = false;
              // }
            });
        });
    },

    convert(properties) {
      console.log(properties);
      let ret = [];
      if (!Array.isArray(properties)) {
        return;
      }
      properties.forEach(property => {
        console.log(property);
        let item = {};
        property.forEach(element => {
          this.$set(item, element.id, element.default);
        });
        ret.push(item);
      });
      return ret;
    }
  }
};
</script>

<style scoped lang="scss">
.paneLabel {
  ::v-deep {
    .el-form-item__label {
      width: 260px !important;
      position: relative;
      left: 124px;
    }
    .el-form-item__content {
      position: absolute;
      left: -100px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 65%;
      margin-left: 140px !important;
    }
    .el-input {
      position: relative;
      left: 165px;
      width: 100% !important;
    }
    .el-radio__input {
      position: relative;
      left: 2px !important;
    }
    .el-radio__label {
      display: contents !important;
    }
  }
}
::v-deep {
  .el-divider {
    background-color: #999 !important;
  }
}
::v-deep {
  .el-collapse-item__header {
    background-color: #ddd;
    border-bottom: 1px solid #efefef;
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
