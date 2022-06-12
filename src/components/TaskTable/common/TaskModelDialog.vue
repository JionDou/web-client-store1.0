<template>
  <el-dialog :visible.sync="dialogFormModelVisible">
    <el-tabs
      v-if="showForm == 0"
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane label="组件" name="first">
        <section>
          <el-card
            class="modelFormHeader"
            style="width: 100%;min-height: 150px;margin-top: 10px;"
          >
            <el-input
              class="inputStyle"
              placeholder="请输入表单主题"
              v-model="form.title"
              clearable
              style="width: 100%;font-size: 18px;"
            ></el-input>
            <el-input
              class="inputStyle"
              type="input"
              placeholder="类型"
              v-model="form.cfg_type"
              style="width: 15%;font-size: 14px; margin-right:8px;"
            ></el-input>
            <el-input
              class="inputStyle"
              type="input"
              placeholder="id"
              v-model="form.id"
              style="width: 18%;font-size: 14px;margin-right:8px;"
            ></el-input>
            <el-input
              class="inputStyle"
              type="input"
              placeholder="描述"
              v-model="form.desc"
              style="width: 35%;font-size: 14px;margin-top:10px;"
            ></el-input>
          </el-card>
          <el-card
            class="box-card"
            style="width: 100%;min-height: 150px;margin-top: 10px;"
            v-for="(item, i) in form.inputArray"
            :key="i"
          >
            <template>
              <el-tag style="margin-right:8px;">{{ i }}</el-tag>
              <el-input
                v-if="form.inputArray[i].cfg_type != 'number'"
                placeholder="请输入标题"
                v-model="form.inputArray[i].title"
                clearable
                style="width: 71%;"
              ></el-input>
              <el-input
                v-if="form.inputArray[i].cfg_type == 'number'"
                placeholder="请输入标题"
                v-model="form.inputArray[i].title"
                clearable
                type="number"
                style="width: 71%;"
              ></el-input>
              <el-select
                v-model="form.inputArray[i].cfg_type"
                placeholder="组件类型选择"
                style="width: 22%;float:right;"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
            <template>
              <el-input
                class="inputStyle"
                type="input"
                placeholder="id"
                v-model="form.inputArray[i].id"
                style="width: 18%;font-size: 16px;margin-left:33px;margin-right:8px;"
              ></el-input>
              <el-input
                class="inputStyle"
                type="input"
                placeholder="描述"
                v-model="form.inputArray[i].desc"
                style="width: 53%;font-size: 14px;margin-top:10px;"
              ></el-input>
            </template>
            <div
              class="inputStyle"
              v-if="form.inputArray[i].cfg_type == 'radio'"
              style="color: grey;margin-left:10px;"
            >
              <div v-for="(item, j) in form.inputArray[i].enum" :key="j">
                ○
                <el-input
                  placeholder="请输入选项名"
                  v-model="item.val"
                  clearable
                  style="width: 35%;margin-right: 8px;"
                ></el-input>
                <el-input
                  class="inputStyle"
                  type="input"
                  placeholder="id"
                  v-model="item.id"
                  style="width: 19%;font-size: 16px;margin-right:8px;"
                ></el-input>
                <el-input
                  class="inputStyle"
                  type="input"
                  placeholder="描述"
                  v-model="item.desc"
                  style="width: 40%;font-size: 14px;margin-top:10px;"
                ></el-input>
              </div>
              <div>
                <el-button type="text" @click="addradio(i)">
                  <i
                    class="el-icon-circle-plus-outline"
                    style="font-size: 20px;margin-top: 10px"
                  ></i>
                </el-button>
                <el-button type="text" @click="deleteradio(i)">
                  <i
                    class="el-icon-remove-outline"
                    style="font-size: 20px;margin-top: 10px"
                  ></i>
                </el-button>
              </div>
            </div>

            <div
              class="inputStyle"
              v-if="form.inputArray[i].cfg_type == 'checkbox'"
              style="color: grey;margin-left:10px;"
            >
              <div v-for="(item, j) in form.inputArray[i].enum" :key="j">
                □
                <el-input
                  placeholder="请输入选项名"
                  v-model="item.val"
                  clearable
                  style="width: 35%;margin-right: 8px;"
                ></el-input>
                <el-input
                  class="inputStyle"
                  type="input"
                  placeholder="id"
                  v-model="item.id"
                  style="width: 19%;font-size: 16px;margin-right:8px;"
                ></el-input>
                <el-input
                  class="inputStyle"
                  type="input"
                  placeholder="描述"
                  v-model="item.desc"
                  style="width: 40%;font-size: 14px;margin-top:10px;"
                ></el-input>
              </div>
              <div>
                <el-button type="text" @click="addcheckbox(i)">
                  <i
                    class="el-icon-circle-plus-outline"
                    style="font-size: 20px;margin-top: 10px"
                  ></i>
                </el-button>
                <el-button type="text" @click="deletecheckbox(i)">
                  <i
                    class="el-icon-remove-outline"
                    style="font-size: 20px;margin-top: 10px"
                  ></i>
                </el-button>
              </div>
            </div>
            <div
              class="inputStyle"
              v-if="form.inputArray[i].cfg_type == 'single_select'"
              style="color: grey;margin-left:10px;"
            >
              <div v-for="(item, j) in form.inputArray[i].enum" :key="j">
                {{ j + 1 }}、
                <el-input
                  placeholder="请输入选项名"
                  v-model="item.val"
                  clearable
                  style="width: 35%;margin-right: 8px;"
                ></el-input>
                <el-input
                  class="inputStyle"
                  type="input"
                  placeholder="id"
                  v-model="item.id"
                  style="width: 18%;font-size: 14px;margin-right:8px;"
                ></el-input>
                <el-input
                  class="inputStyle"
                  type="input"
                  placeholder="描述"
                  v-model="item.desc"
                  style="width: 40%;font-size: 14px;margin-top:10px;"
                ></el-input>
              </div>
              <div>
                <el-button type="text" @click="addSingleSelect(i)">
                  <i
                    class="el-icon-circle-plus-outline"
                    style="font-size: 20px;margin-top: 10px"
                  ></i>
                </el-button>
                <el-button type="text" @click="deleteSingleSelect(i)">
                  <i
                    class="el-icon-remove-outline"
                    style="font-size: 20px;margin-top: 10px"
                  ></i>
                </el-button>
              </div>
            </div>
            <div
              v-if="form.inputArray[i].cfg_type == 'datetime'"
              class="inputStyle"
              style="color: grey;margin-left:10px;"
            >
              <el-date-picker
                v-model="form.inputArray[i].date"
                type="datetime"
                placeholder="选择日期时间"
              ></el-date-picker>
            </div>
            <div
              v-if="form.inputArray[i].cfg_type == 'datetimerange'"
              class="inputStyle"
              style="color: grey;margin-left:10px;"
            >
              <el-date-picker
                v-model="form.inputArray[i].enum"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>

            <div
              class="inputStyle"
              v-if="form.inputArray[i].cfg_type == 'multi_select'"
              style="color: grey;margin-left:10px;"
            >
              <div v-for="(item, j) in form.inputArray[i].enum" :key="j">
                {{ j + 1 }}、
                <el-input
                  placeholder="请输入选项名"
                  v-model="item.val"
                  clearable
                  style="width: 35%;margin-right: 8px;"
                ></el-input>
                <el-input
                  class="inputStyle"
                  type="input"
                  placeholder="id"
                  v-model="item.id"
                  style="width: 18%;font-size: 14px;margin-right:8px;"
                ></el-input>
                <el-input
                  class="inputStyle"
                  type="input"
                  placeholder="描述"
                  v-model="item.desc"
                  style="width: 40%;font-size: 14px;margin-top:10px;"
                ></el-input>
              </div>
              <div>
                <el-button type="text" @click="addMultiSelect(i)">
                  <i
                    class="el-icon-circle-plus-outline"
                    style="font-size: 20px;margin-top: 10px"
                  ></i>
                </el-button>
                <el-button type="text" @click="deleteMultiSelect(i)">
                  <i
                    class="el-icon-remove-outline"
                    style="font-size: 20px;margin-top: 10px"
                  ></i>
                </el-button>
              </div>
            </div>
          </el-card>
          <div style="text-align: right;width:100%;margin-top: 10px;">
            <el-tooltip
              class="item"
              effect="light"
              content="添加新组件"
              placement="top"
            >
              <el-button type="text" @click="adddiv" style="font-size: 30px;">
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
                @click="delectdiv"
                style="font-size: 30px;"
              >
                <i class="el-icon-remove"></i>
              </el-button>
            </el-tooltip>
          </div>
        </section>
      </el-tab-pane>
      <el-tab-pane label="列表">
        <el-card
          class="list-card"
          style="width: 100%;min-height: 150px;margin-top: 10px;"
          v-for="(item, i) in form.listArray"
          :key="i"
        >
          <template>
            <el-tag style="margin-right:8px;">{{ i + 1 }}</el-tag>
            <el-input
              placeholder="请输入标题"
              v-model="form.listArray[i].title"
              clearable
              style="width: 71%;"
            ></el-input>
            <el-select
              v-model="form.listArray[i].val_type"
              placeholder="列表类型选择"
              style="width: 22%;float:right;"
            >
              <el-option
                v-for="item in listTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template>
            <el-input
              class="inputStyle"
              type="input"
              placeholder="id"
              v-model="form.listArray[i].id"
              style="width: 18%;font-size: 16px;margin-left:33px;margin-right:8px;"
            ></el-input>
          </template>
          <div class="inputStyle" style="color: grey;margin-left:10px;">
            <div v-for="(item, j) in form.listArray[i].properties" :key="j">
              □
              <el-input
                placeholder="请输入选项名"
                v-model="item.title"
                clearable
                style="width: 35%;margin-right: 8px;"
              ></el-input>
              <el-input
                class="inputStyle"
                type="input"
                placeholder="id"
                v-model="item.id"
                style="width: 19%;font-size: 16px;margin-right:8px;"
              ></el-input>
              <el-input
                class="inputStyle"
                type="input"
                placeholder="描述"
                v-model="item.desc"
                style="width: 40%;font-size: 14px;margin-top:10px;"
              ></el-input>
            </div>
            <div>
              <el-button type="text" @click="addListArrayItem(i)">
                <i
                  class="el-icon-circle-plus-outline"
                  style="font-size: 20px;margin-top: 10px"
                ></i>
              </el-button>
              <el-button type="text" @click="deleteListArrayItem(i)">
                <i
                  class="el-icon-remove-outline"
                  style="font-size: 20px;margin-top: 10px"
                ></i>
              </el-button>
            </div>
          </div>
        </el-card>
        <div style="text-align: right;width:100%;margin-top: 10px;">
          <el-tooltip
            class="item"
            effect="light"
            content="添加新组件"
            placement="top"
          >
            <el-button
              type="text"
              @click="addListCard"
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
              @click="deleteListCard"
              style="font-size: 30px;"
            >
              <i class="el-icon-remove"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <div style="text-align: center;margin-top:10px;">
        <el-button type="primary" @click="submit()">预览发布</el-button>
      </div>
    </el-tabs>

    <section v-if="showForm == 1">
      <div style="font-size: 18px;" v-html="form.title"></div>
      <el-form
        :option="option"
        label-position="right"
        label-width="135px"
        @on-submit="onSubmit"
        style="width:100%;margin-top: 20px;"
      >
        <el-form-item
          v-for="(item, j) in yulanform.schema_info.common.properties"
          :key="j"
          :label="item.title"
          required
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="item.desc ? item.desc : ' '"
            placement="left-end"
          >
            <i
              class="el-icon-warning-outline"
              style="display: inline-block;font-size:18px;margin-right:10px;"
            ></i>
          </el-tooltip>
          <el-input
            v-if="item.cfg_type === 'input'"
            clearable
            v-model="item.val"
            style="width: 85%;"
          ></el-input>
          <!-- <el-input v-if="item.cfg_type === 'number'" type="number" v-model="item.val"></el-input> -->
          <el-select
            v-if="item.cfg_type === 'single_select'"
            v-model="item.checkedVal"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, i) in item.enum"
              :key="i"
              :label="item.val"
              :value="item.val"
            ></el-option>
          </el-select>
          <el-select
            v-if="item.cfg_type === 'multi_select'"
            v-model="item.checkedVal"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="(item, i) in item.enum"
              :key="i"
              :label="item.val"
              :value="item.val"
            ></el-option>
          </el-select>
          <el-radio-group
            v-if="item.cfg_type === 'radio'"
            v-model="item.checkedVal"
          >
            <el-radio
              v-for="(ra, index) in item.enum"
              :key="index"
              :label="ra.val"
            ></el-radio>
          </el-radio-group>
          <el-checkbox-group
            v-if="item.cfg_type === 'checkbox'"
            v-model="item.checkedVal"
          >
            <el-checkbox
              v-for="(ch, index) in item.enum"
              :key="index"
              :label="ch.val"
              >{{ ch.val }}</el-checkbox
            >
          </el-checkbox-group>
          <el-date-picker
            v-if="item.cfg_type === 'datetime'"
            v-model="item.checkedVal"
            disabled
            type="datetime"
            placeholder="日期选择"
          ></el-date-picker>
          <el-date-picker
            v-if="item.cfg_type === 'datetimerange'"
            v-model="item.checkedVal"
            disabled
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-tabs v-model="yulanActiveName" @tab-click="handleClick" type="card">
          <el-tab-pane
            v-for="(item, index) in this.yulanform.schema_info.pages"
            :key="index"
            :label="item.title"
            :name="item.id"
          >
            <template v-if="item.val_type == 'object'">
              <el-form-item
                v-for="(item, i) in item.properties"
                :key="i"
                :label="item.title"
                style="margin-top:20px;"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.desc ? item.desc : ' '"
                  placement="left-end"
                >
                  <i
                    class="el-icon-warning-outline"
                    style="display: inline-block;font-size:18px;margin-right:10px;"
                  ></i>
                </el-tooltip>
                <el-input
                  v-if="item.cfg_type === 'text'"
                  v-model="item.default"
                  type="input"
                  :placeholder="item.placeholder"
                  style="width:40%;"
                ></el-input>
              </el-form-item>
            </template>
            <template v-if="item.val_type == 'json'">
              <json-viewer
                :value="item"
                :expand-depth="5"
                copyable
                boxed
                sort
                style="position:relative; width:100%;margin-bottom:20px;"
              ></json-viewer>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog
        width="45%"
        title="JSON预览"
        :visible.sync="innerVisible"
        append-to-body
      >
        <json-viewer
          :value="yulanform"
          :expand-depth="5"
          copyable
          boxed
          sort
          style="position:relative; width:100%;margin-bottom:20px;"
        ></json-viewer>
        <div
          style="display: flex;align-items: center;justify-content: flex-end;"
        >
          <el-button @click="innerVisible = false" size="medium"
            >取 消</el-button
          >
          <el-button type="success" size="medium" @click="onSure"
            >确定</el-button
          >
        </div>
      </el-dialog>
      <div style="text-align: center;">
        <el-button type="primary" @click="changeShowForm(0)"
          >返回修改</el-button
        >
        <el-button type="primary" @click="onSubmit(yulanform)"
          >立即发布</el-button
        >
      </div>
    </section>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogFormModelVisible: false,
      innerVisible: false,
      activeName: "first",
      yulanActiveName: 0,
      showForm: 0,

      //卡片的个数
      num: 1,
      //组件选择框
      options: [
        {
          value: "input",
          label: "文本"
        },
        // {
        //   value: "number",
        //   label: "数字",
        // },
        {
          value: "radio",
          label: "单选按钮"
        },
        {
          value: "checkbox",
          label: "多选按钮"
        },
        {
          value: "single_select",
          label: "单项下拉选择"
        },
        {
          value: "multi_select",
          label: "多项下拉选择"
        },
        {
          value: "datetime",
          label: "日期时间"
        },
        {
          value: "datetimerange",
          label: "日期时间范围"
        }
      ],
      //列表选择框
      listTypes: [
        {
          value: "object",
          label: "object"
        },
        {
          value: "json",
          label: "json"
        },
        {
          value: "single_select",
          label: "single_select"
        }
      ],
      //生成的表单规则
      formrule: [
        {
          validate: [
            {
              required: true,
              type: "number",
              min: 2,
              message: "请大于2颗星",
              trigger: "change"
            }
          ]
        }
      ],

      //表单实例对象
      yulanform: {},

      option: {
        submitBtn: {
          show: false
        }
      },
      form: {
        title: "",
        desc: "",
        cfg_type: "",
        id: "",

        listArray: [this.newListItem()],
        inputArray: [this.newSelectItem()]
      }
    };
  },
  methods: {
    handleClick() {
      console.log("handleClick");
    },
    //增加组件
    adddiv() {
      this.form.inputArray.push(this.newSelectItem());
      console.log("form");
      console.log(this.form);
    },
    newListItem() {
      return {
        val_type: "object",
        cfg_type: "object",
        id: "",
        title: "",
        properties: [this.newListChildItem()]
      };
    },
    newListChildItem() {
      return {
        id: "",
        val_type: "",
        cfg_type: "text",
        title: "",
        default: "",
        desc: ""
      };
    },
    newSelectItem() {
      return {
        cfg_type: "input",
        id: "",
        desc: "",
        title: "",
        date: "",
        enum: [this.newEnumItem()]
      };
    },
    newEnumItem() {
      return {
        id: "",
        val: "",
        desc: ""
      };
    },
    //删除组件
    delectdiv() {
      if (this.form.inputArray.length > 1) {
        this.form.inputArray.pop();
      }
    },
    //增加单选按钮选项，实时更新数组用$set
    addradio(i) {
      this.form.inputArray[i].enum.push(this.newEnumItem());
      // this.$set(this.form.radionum, i, this.form.radionum[i] + 1);
      // this.radionum[i] +=1;
    },
    deleteradio(i) {
      this.form.inputArray[i].enum.pop();
      // this.$set(this.form.radionum, i, this.form.radionum[i] - 1);
    },

    //增加多选按钮选项
    addcheckbox(i) {
      this.form.inputArray[i].enum.push(this.newEnumItem());
    },
    deletecheckbox(i) {
      if (this.form.inputArray[i].enum.length <= 2) {
        console.log("deletecheckbox num == 2");
        return;
      }
      this.form.inputArray[i].enum.pop();
    },

    //增加下拉框选项
    addSingleSelect(i) {
      this.form.inputArray[i].enum.push(this.newEnumItem());
    },
    deleteSingleSelect(i) {
      this.form.inputArray[i].enum.pop();
    },
    addMultiSelect(i) {
      this.form.inputArray[i].enum.push(this.newEnumItem());
    },
    deleteMultiSelect(i) {
      this.form.inputArray[i].enum.pop();
    },
    addListArrayItem(i) {
      this.form.listArray[i].properties.push(this.newListChildItem());
    },
    deleteListArrayItem(i) {
      this.form.listArray[i].properties.pop();
    },

    //增加组件
    addListCard() {
      this.form.listArray.push(this.newListItem());
    },
    //删除组件
    deleteListCard() {
      if (this.form.listArray.length > 1) {
        this.form.listArray.pop();
      }
    },

    submit() {
      this.yulanform = {
        schema_info: {
          common: {
            cfg_type: this.form.cfg_type,
            title: this.form.title,
            id: this.form.id,
            desc: this.form.desc,
            properties: []
          },
          pages: []
        }
      };
      for (let i = 0; i < this.form.inputArray.length; i++) {
        if (
          this.form.inputArray[i].cfg_type == "radio" ||
          this.form.inputArray[i].cfg_type == "single_select"
        ) {
          this.yulanform.schema_info.common.properties.push({
            cfg_type: this.form.inputArray[i].cfg_type,
            title: this.form.inputArray[i].title,
            id: this.form.inputArray[i].id,
            desc: this.form.inputArray[i].desc,
            enum: this.form.inputArray[i].enum,
            checkedVal: this.form.inputArray[i].enum[0].val
          });
        } else if (
          this.form.inputArray[i].cfg_type == "checkbox" ||
          this.form.inputArray[i].cfg_type == "multi_select"
        ) {
          let defautVal = [];
          let enumTmp = [];
          this.form.inputArray[i].enum.forEach(element => {
            if (
              element.val !== null &&
              element.val !== "" &&
              element.id !== null &&
              element.id !== ""
            ) {
              defautVal.push(element.val);
              enumTmp.push(element);
            }
          });
          this.yulanform.schema_info.common.properties.push({
            cfg_type: this.form.inputArray[i].cfg_type,
            title: this.form.inputArray[i].title,
            id: this.form.inputArray[i].id,
            desc: this.form.inputArray[i].desc,
            enum: this.form.inputArray[i].enum,
            checkedVal: defautVal
          });
        } else if (this.form.inputArray[i].cfg_type == "datetime") {
          this.yulanform.schema_info.common.properties.push({
            cfg_type: this.form.inputArray[i].cfg_type,
            title: this.form.inputArray[i].title,
            id: this.form.inputArray[i].id,
            desc: this.form.inputArray[i].desc,
            checkedVal: this.form.inputArray[i].date
          });
        } else if (this.form.inputArray[i].cfg_type == "datetimerange") {
          this.yulanform.schema_info.common.properties.push({
            cfg_type: this.form.inputArray[i].cfg_type,
            title: this.form.inputArray[i].title,
            id: this.form.inputArray[i].id,
            desc: this.form.inputArray[i].desc,
            checkedVal: this.form.inputArray[i].enum
          });
        } else {
          console.log("else 分支");
          this.yulanform.schema_info.common.properties.push({
            cfg_type: this.form.inputArray[i].cfg_type,
            title: this.form.inputArray[i].title,
            id: this.form.inputArray[i].id,
            desc: this.form.inputArray[i].desc,
            val: ""
          });
        }
      }
      this.yulanform.schema_info.pages = this.form.listArray;
      if (this.yulanform.schema_info.pages.length > 0) {
        this.yulanActiveName = this.yulanform.schema_info.pages[0].id;
      }
      this.showForm = 1;
      console.log("预览:");
      console.log(this.yulanform.schema_info);
    },
    onSubmit(yulanform) {
      console.log(JSON.stringify(yulanform));
      this.innerVisible = true;
    },
    onSure() {
      this.innerVisible = false;

      this.dialogFormModelVisible = false;
    },
    changeShowForm(msg) {
      console.log(this.yulanform.schema_info.common.properties);
      this.showForm = msg;
    },
    changeindex(msg) {
      this.$emit("NewIndex", msg);
    }
  }
};
</script>

<style scoped lang="scss">
.inputStyle .el-input__inner {
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
}
.radio1 .el-input__inner {
  width: 100%;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  /*outline: medium;*/
}
.textarea .el-textarea__inner {
  width: 100%;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 1px;
  /*outline: medium;*/
}
</style>
