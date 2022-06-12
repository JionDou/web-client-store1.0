<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-position="right"
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
        v-if="item.val_type === 'string' || item.val_type === 'number'"
        v-model="item.default"
        type="input"
        disabled
        style="width:60%;"
      >
      </el-input>
      <el-select
        v-model="item.default"
        placeholder="请选择"
        disabled
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
          <el-collapse-item name="1" title="">
            <template slot="title">
              <!-- <el-checkbox
                disabled
                style="padding-left:6px;"
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              ></el-checkbox>
              <span style="padding-left:6px;">数值保存</span>
              <span style="padding-left:6px;">标记</span>
              <span style="padding-left:6px;">备注</span> -->
              <div
                style="margin-left:20px;border:1px solid #333;line-height:26px;text-align:center;border-radius: 2px;width: 93%;"
              >
                数组元素： 展开/收缩
              </div>
            </template>
            <div
              v-for="(property, i) in item.items.properties"
              :key="i"
              style="margin-top:6px;"
              class="paneLabel"
            >
              <el-form-item
                v-for="(item, i) in property"
                :key="i"
                :label="item.title"
                class="paneLabel"
              >
                <div
                  style="display: contents;align-items: center;justify-content: center;"
                >
                  <el-checkbox disabled :model="item"></el-checkbox>
                  <el-radio disabled v-model="radio"></el-radio>
                </div>
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
                  disabled
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
              <el-divider></el-divider>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script>
import axios from "axios";
import { getMobileTaskModelData, getDetailTaskId } from "@/api/task";
export default {
  name: "DetailTask",
  components: {},
  data() {
    return {
      checkAll: false,
      isIndeterminate: true,
      isSubmitVisble: true,
      loading: false,
      radio: "1",
      activeNames: 0, //折叠面板
      tabPosition: "left",
      activeName: "AVehicleFreeExperienceCommonCfg",
      ruleForm: {
        content: {
          common: {},
          pages: []
        }
      },
      common: [], //任务列表公共部分数据
      pages: [],
      properties: [], //任务列表pages里的properties数据
      rules: {}
    };
  },
  mounted() {
    this.createMobileTask();
    this.getDetailTaskId();
  },
  methods: {
    handleCheckAllChange(val) {
      this.isIndeterminate = false;
    },
    handleClick(tab) {
      this.currentTabComponent = tab.paneName;
    },
    //获取任务模板数据
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

    //获取查看任务id
    async getDetailTaskId(id) {
      let data = "";
      const res = await getDetailTaskId(data, 2);
      console.log(res);
      console.log(this.pages);
      let pagesValObj = res.data.content.pages;
      this.pages.forEach(page => {
        if (page.cfg_type === "array") {
          for (let i = 0; i < pagesValObj[`${page.id}`].length - 1; i++) {
            let newItem = JSON.parse(JSON.stringify(page.items.properties[0]));
            // newItem.forEach(item => (item.default = ""));
            page.items.properties.push(newItem);
          }
          page.items.properties.forEach((property, index) => {
            property.forEach(item => {
              item.default = pagesValObj[`${page.id}`][index][`${item.id}`];
            });
          });
        }
      });
    },
    sumbim() {
      this.isShow = false;
    },
    cancel() {
      this.isShow = false;
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
      text-align: left;
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
    .el-divider {
      background-color: #999;
    }
  }
}
::v-deep {
  .el-collapse-item__header {
    background-color: #ddd;
    border-bottom: 1px solid #fff;
  }
  .el-collapse-item__wrap {
    background-color: #ddd;
    border-bottom: 1px solid #fff;
  }
  .el-collapse {
    margin-top: 15px;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #fff;
  }
}
.finish {
  ::v-deep {
    .el-form-item__content {
      margin-left: 0 !important;
    }
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
