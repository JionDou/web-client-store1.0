<template>
  <div>
    <section class="cel-from-header" v-if="showForm == 0">
      <el-tabs
        v-model="outActiveName"
        type="card"
        :tab-position="tabPosition"
        class="outTabs"
        style="padding:0 20px;"
        @tab-click="handleOutTabClick"
      >
        <template v-for="item in tabMenu">
          <el-tab-pane
            :key="item.name"
            :label="item.name"
            :name="item.name"
            style="padding:30px 20px;"
          >
            <span slot="label">
              <i class="el-icon-d-caret"></i>
              <el-dropdown
                placement="bottom"
                @command="handleCommand"
                trigger="click"
              >
                <span>{{ item.label }}</span>
                <el-dropdown-menu slot="dropdown" class="dropown">
                  <el-dropdown-item
                    v-for="(item, i) in form.listArray"
                    :key="i"
                    :command="i"
                  >
                    <span>{{ item.title }}</span>
                  </el-dropdown-item>
                  <el-row
                    style="display: flex;align-items: center;justify-content: center;"
                  >
                    <el-tooltip
                      class="item"
                      effect="light"
                      content="添加pages"
                      placement="bottom"
                    >
                      <el-button
                        type="text"
                        @click="addPageCard"
                        style="font-size: 20px;"
                      >
                        <i class="el-icon-circle-plus"></i>
                      </el-button>
                    </el-tooltip>
                  </el-row>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
            <el-card
              class="box-card"
              style="width: 100%;min-height: 150px;padding-top:53px;"
              v-for="(page, i) in form.pageItemList"
              :key="i"
            >
              <template>
                <el-form label-position="right" label-width="80px">
                  <el-tooltip
                    class="item"
                    effect="light"
                    content="删除pages"
                    placement="right"
                  >
                    <el-button
                      type="text"
                      @click="deletePageCard(page)"
                      style="position:absolute;top:24px;"
                    >
                      <i
                        class="el-icon-remove-outline"
                        style="font-size:20px;margin-top: 10px;"
                      ></i>
                    </el-button>
                  </el-tooltip>
                  <el-form-item
                    label="标题"
                    style="position: relative;top: -38px;left:40px;"
                  >
                    <el-input
                      placeholder="请输入标题"
                      v-model="page.title"
                      clearable
                      style="width:54%;"
                    ></el-input>
                    <el-select
                      v-model="page.cfg_type"
                      placeholder="组件类型选择"
                      style="width: 34%;margin-left:45px;"
                    >
                      <el-option
                        v-for="item in listTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="ID字段"
                    style="position: relative;top: -47px;left:40px;"
                  >
                    <el-input
                      class="inputStyle"
                      type="input"
                      placeholder="id"
                      clearable
                      v-model="page.id"
                      style="width:54%;margin-right:8px;"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="描述"
                    style="position: relative;top: -56px;left:40px;"
                  >
                    <el-input
                      class="inputStyle"
                      type="input"
                      placeholder="描述"
                      clearable
                      v-model="page.desc"
                      style="width:95%;"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </template>
              <el-tabs
                v-model="activeName"
                type="card"
                @tab-click="handleClick"
                style="padding:30px 20px;"
              >
                <el-tab-pane class="firstPanel" label="常规配置" name="first">
                  <section>
                    <template v-if="page.cfg_type !== 'json'">
                      <draggable
                        class="list-group"
                        tag="ul"
                        v-model="form.listArray"
                        v-bind="dragOptions"
                        @start="isDragging = true"
                        @end="isDragging = false"
                      >
                        <el-card
                          class="box-card"
                          style="width: 100%;min-height: 150px;margin-top: 10px;"
                          v-for="(item, i) in form.pageItemList[0].items
                            .properties[0]"
                          :key="i"
                        >
                          <template>
                            <el-form label-position="right" label-width="80px">
                              <el-tag style="margin-right:8px;">{{
                                i + 1
                              }}</el-tag>
                              <el-form-item
                                label="标题"
                                style="position: relative;top: -38px;left:40px;"
                              >
                                <el-input
                                  placeholder="请输入标题"
                                  v-model="item.title"
                                  clearable
                                  style="width: 52%;"
                                ></el-input>
                                <el-select
                                  v-model="item.cfg_type"
                                  placeholder="组件类型选择"
                                  style="width: 34%;margin-left:53px;"
                                >
                                  <el-option
                                    v-for="item in cfgTypes"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  ></el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item
                                label="ID字段"
                                style="position: relative;top: -47px;left:40px;"
                              >
                                <el-input
                                  class="inputStyle"
                                  type="input"
                                  placeholder="id"
                                  clearable
                                  v-model="item.id"
                                  style="width: 52%;margin-right:8px;"
                                ></el-input>
                                <el-select
                                  v-if="item.cfg_type !== 'object'"
                                  @change="changeInputItemType(item)"
                                  v-model="item.val_type"
                                  placeholder="组件类型选择"
                                  style="width: 34%;margin-left:45px;"
                                  clearable
                                >
                                  <el-option
                                    v-for="item in valTypes"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  ></el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item
                                label="描述"
                                style="position: relative;top: -56px;left:40px;"
                              >
                                <el-input
                                  class="inputStyle"
                                  type="input"
                                  placeholder="描述"
                                  clearable
                                  v-model="item.desc"
                                  style="width:95%;"
                                ></el-input>
                              </el-form-item>
                              <el-form-item
                                label="路径"
                                style="position: relative;top: -56px;left:40px;"
                              >
                                <el-input
                                  class="inputStyle"
                                  type="input"
                                  placeholder="路径"
                                  clearable
                                  style="width:95%;"
                                ></el-input>
                              </el-form-item>
                              <el-form-item
                                label="默认值"
                                style="position: relative;top: -56px;left:40px;"
                                v-if="item.val_type !== 'json'"
                              >
                                <el-input
                                  class="inputStyle"
                                  type="input"
                                  placeholder="默认值"
                                  clearable
                                  v-model="item.default"
                                  style="width:95%;"
                                ></el-input>
                              </el-form-item>
                              <el-form-item
                                label="可选项"
                                v-if="
                                  item.cfg_type == 'single_select' ||
                                    item.cfg_type === 'multi_select'
                                "
                                style="position: relative;top:-65px;left:40px;"
                              >
                                <div
                                  class="selectMayStyle"
                                  style="color:grey;border: 1px solid #ddd;border-radius: 4px;width:95%;"
                                >
                                  <div v-for="(item, j) in item.enum" :key="j">
                                    <el-tag style="margin-left: 5px;">
                                      {{ j + 1 }}
                                    </el-tag>
                                    <el-input
                                      placeholder="标题"
                                      v-model="item.val"
                                      clearable
                                      style="width:30%;margin-left:6px;"
                                    ></el-input>
                                    <el-input
                                      class="inputStyle"
                                      type="input"
                                      placeholder="id字段"
                                      clearable
                                      v-model="item.id"
                                      style="width:20%;margin-left:6px;"
                                    ></el-input>
                                    <el-input
                                      class="inputStyle"
                                      type="input"
                                      placeholder="描述"
                                      clearable
                                      v-model="item.desc"
                                      style="width: 38%;margin-top:10px;margin-left:6px;"
                                    ></el-input>
                                  </div>
                                  <div
                                    style="display: flex;align-items:center;justify-content:flex-end;margin-right:3px;"
                                  >
                                    <el-button
                                      type="text"
                                      @click="addSingleListSelect(item, i)"
                                    >
                                      <i
                                        class="el-icon-circle-plus-outline"
                                        style="font-size: 20px;margin-top: 10px;"
                                      ></i>
                                    </el-button>
                                    <el-button
                                      type="text"
                                      @click="deleteSingleListSelect(item, i)"
                                    >
                                      <i
                                        class="el-icon-remove-outline"
                                        style="font-size: 20px;margin-top: 10px"
                                      ></i>
                                    </el-button>
                                  </div>
                                </div>
                              </el-form-item>
                              <div
                                v-if="
                                  item.val_type === 'json' ||
                                    item.cfg_type === 'json'
                                "
                                class="routeManagement"
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
                            </el-form>
                          </template>
                        </el-card>
                      </draggable>
                    </template>
                    <el-card
                      class="box-card"
                      style="width: 100%;min-height: 150px;margin-top: 10px;"
                      v-if="page.cfg_type === 'json'"
                    >
                      <div
                        class="routeManagement"
                        style="position: relative;top: -23px;"
                      >
                        <vue-json-editor
                          v-model="page.default"
                          :showBtns="false"
                          lang="zh"
                          @json-change="onJsonChange"
                          @json-save="onJsonSave"
                        />
                      </div>
                    </el-card>
                    <!-- 常规配置 end-->

                    <!-- 添加，删除组件按钮 -->
                    <div style="text-align: right;width:100%;margin-top: 10px;">
                      <el-tooltip
                        class="item"
                        effect="light"
                        content="添加新组件"
                        placement="top"
                      >
                        <el-button
                          type="text"
                          @click="
                            adddiv(form.pageItemList[0].items.properties[0])
                          "
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
                          @click="
                            delectdiv(form.pageItemList[0].items.properties[0])
                          "
                          style="font-size: 30px;"
                        >
                          <i class="el-icon-remove"></i>
                        </el-button>
                      </el-tooltip>
                    </div>
                    <!-- 添加，删除组件按钮 end -->
                  </section>
                </el-tab-pane>
                <el-tab-pane label="节点配置"></el-tab-pane>
              </el-tabs>
            </el-card>

            <!-- {{ selected === "" ? "无" : form.listArray[selected] }} -->
          </el-tab-pane>
        </template>
        <div style="text-align: center;margin-top:10px;margin-bottom:30px;">
          <el-button type="primary" @click="submit()">预览发布</el-button>
        </div>
      </el-tabs>
    </section>
    <!-- 表单模板预览页面 -->
    <section v-if="showForm == 1">
      <!-- <div style="font-size: 18px;" v-html="form.title"></div> -->
      <el-form
        :option="option"
        label-position="left"
        label-width="175px"
        @on-submit="onSubmit"
        style="width:100%;padding-top:20px;"
      >
        <el-tabs
          v-model="yulanActiveName"
          :tab-position="tabPosition"
          @tab-click="handleClick"
          type="card"
          class="outTabs"
          style="margin:10px 20px;"
        >
          <el-tab-pane
            v-for="(item, index) in this.yulanform.schema_info.pages"
            :key="index"
            :label="item.title"
            :name="item.id"
          >
            <template v-if="item.cfg_type == 'array'">
              <el-form-item
                v-for="(item, i) in item.items.properties[0]"
                :key="i"
                :label="item.title"
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
                  v-model="item.default"
                  type="input"
                  :placeholder="item.placeholder"
                  style="width:70%;"
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
                  ></el-option>
                </el-select>
                <template v-if="item.val_type == 'json'">
                  <json-viewer
                    :value="item.default"
                    :expand-depth="5"
                    copyable
                    boxed
                    sort
                    style="position:relative; width:100%;margin-bottom:20px;"
                  ></json-viewer>
                </template>
              </el-form-item>
            </template>
            <template v-if="item.val_type == 'json'">
              <json-viewer
                :value="item.default"
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
        class="browse_dialog"
      >
        <div class="routeManagement">
          <vue-json-editor
            v-model="yulanform"
            :showBtns="false"
            lang="zh"
            @json-change="onJsonChange"
            @json-save="onJsonSave"
          />
        </div>
        <div
          style="display: flex;align-items: center;justify-content: flex-end;"
        >
          <el-dialog
            width="30%"
            title="comment"
            :visible.sync="deepInnerVisible"
            append-to-body
          >
            <el-input v-model="comment" type="textarea" placeholder></el-input>
            <el-row>
              <el-col
                :span="24"
                style="display: flex;align-items: center;justify-content: flex-end;margin-top: 10px;"
              >
                <el-button type="success" @click="onSure" size="mini"
                  >确定</el-button
                >
              </el-col>
            </el-row>
          </el-dialog>
          <el-button @click="innerVisible = false" size="medium"
            >取 消</el-button
          >
          <el-button
            type="success"
            size="medium"
            @click="deepInnerVisible = true"
            style="margin-right:10px;"
            >提交</el-button
          >
        </div>
      </el-dialog>
      <div style="text-align:center; padding-bottom:20px;">
        <el-button type="primary" @click="changeShowForm(0)"
          >返回修改</el-button
        >
        <el-button type="primary" @click="onSubmit(yulanform)"
          >立即发布</el-button
        >
      </div>
    </section>
    <!-- 表单模板预览页面 end-->
  </div>
</template>

<script>
import vueJsonEditor from "vue-json-editor";
import draggable from "vuedraggable";
import { getNewTaskProcessAct, onSubmitActiveModelCfgData } from "@/api/task";

export default {
  name: "ActiveCfgDialog",
  components: {
    vueJsonEditor,
    draggable
  },
  data() {
    return {
      tabMenu: [
        {
          label: "pages",
          name: "pages"
        }
      ],
      activeName: "pages",
      selected: "",
      innerVisible: false,
      deepInnerVisible: false,
      activeName: "first",
      outActiveName: "pages",
      yulanActiveName: 0,
      showForm: 0,
      tabPosition: "left",
      comment: "",
      //卡片的个数
      num: 1,
      //组件选择框
      cfgTypes: [
        {
          value: "text",
          label: "text"
        },
        {
          value: "single_select",
          label: "single_select"
        },
        {
          value: "multi_select",
          label: "multi_select"
        },
        {
          value: "object",
          label: "object"
        },
        {
          value: "array",
          label: "array"
        }
      ],
      valTypes: [
        {
          value: "string",
          label: "string"
        },
        {
          value: "number",
          label: "number"
        },
        {
          value: "json",
          label: "json"
        },
        {
          value: "refer",
          label: "refer"
        },
        {
          value: "object",
          label: "object"
        }
      ],
      //列表选择框
      listTypes: [
        {
          value: "object",
          label: "Object"
        },
        {
          value: "json",
          label: "JSON"
        },
        {
          value: "array",
          label: "Array"
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
              message: "不能为空",
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
        title: "公共",
        cfg_type: "object",
        id: "common",
        pageName: "pages",
        pageItemIndex: 0,
        pageItem: "",
        version: "",
        time: "",
        pageItemList: [this.newListItem()],
        listArray: [this.newListItem()],
        inputArray: [this.newSelectItem()]
      }
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  mounted() {
    this.getNewTaskProcessAct();
  },
  methods: {
    onJsonChange() {},
    onJsonSave() {},
    handleClick() {
      console.log("handleClick");
    },
    //增加组件
    adddiv(array) {
      array.push(this.newSelectItem());
    },
    newListItem() {
      return {
        val_type: "",
        cfg_type: "",
        id: "",
        title: "",
        items: {
          properties: [[this.newListChildItem()]],
          type: "object"
        }
      };
    },
    newListChildItem() {
      return {
        id: "",
        val_type: "",
        cfg_type: "",
        title: "",
        default: "",
        desc: ""
      };
    },
    newSelectItem() {
      return {
        val_type: "",
        cfg_type: "",
        id: "",
        desc: "",
        title: "",
        default: "0",
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
    changeItemType(item) {
      if (item.cfg_type === "number") {
        if (item.enum) {
          this.$delete(item, "enum");
        }
      } else if (!item.enum) {
        this.$set(item, "enum", []);
      }
      // 清空选项,并且新增一个空对象
      if (item.enum) {
        item.enum = [];
        item.enum.push(this.newEnumItem());
      }
    },
    changeInputItemType(item) {
      console.log("start.");
      console.log(item);
      if (item.val_type === "number") {
        if (item.enum) {
          this.$delete(item, "enum");
        }
      } else if (!item.enum) {
        this.$set(item, "enum", []);
      }
      // 清空选项,并且新增一个空对象
      if (item.enum) {
        item.enum = [];
        item.enum.push(this.newEnumItem());
      }
    },
    handleCommand(index) {
      if (this.outActiveName !== "pages") {
        this.outActiveName = "pages";
      }
      this.selected = index;
      this.form.pageItemList = [];
      this.form.pageItemList.push(this.form.listArray[index]);
      this.setPageName(this.form.pageItemList[0].title);
    },
    handleOutTabClick() {
      if (this.outActiveName != "pages" || this.form.pageItemList.length == 0) {
        this.form.pageItemList = [];
        this.form.pageItemList.push(this.newListItem());
      }
    },
    async getNewTaskProcessAct() {
      //获取手游模板数据
      this.loading = true;
      let params = {
        branch: "trunk"
      };
      const res = await getNewTaskProcessAct(params);
      if (res.code === 200 || res.code === 201) {
        let schemaData = res.data.schema_info;
        this.form.listArray = schemaData.pages;
        this.form.listArray.forEach(x => {
          x.title = x.title.split("-")[1];
          let properties = x.items.properties;
          x.items.properties = [];
          x.items.properties.push(properties);
        });
        console.log(this.form.listArray);
        if (this.form.listArray.length > 0) {
          this.form.pageItemList = [];
          this.form.pageItemList.push(this.form.listArray[0]);
        }
        console.log(this.form.pageItemList);
        this.loading = false;
      }
    },

    //删除组件
    delectdiv(array) {
      if (array.length > 1) {
        array.pop();
      }
    },
    //增加下拉框选项
    addSingleSelect(i) {
      this.form.inputArray[i].enum.push(this.newEnumItem());
    },
    addSingleListSelect(i) {
      if (!i.enum) {
        i.enum = [];
      }
      i.enum.push(this.newEnumItem());
    },
    deleteSingleListSelect(i) {
      if (!i.enum) {
        i.enum = [];
      }
      i.enum.pop(this.newEnumItem());
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
    addPageCard() {
      let item = this.newListItem();
      this.form.listArray.push(item);
      this.form.pageItemList = [];
      this.form.pageItemList.push(item);
    },
    deletePageCard(item) {
      console.log(item);
      let index = this.form.listArray.indexOf(item);
      this.form.listArray.splice(index, 1);
      this.form.pageItemList = [];
      if (index < this.form.listArray.length) {
        this.form.pageItemList.push(this.form.listArray[index]);
        this.setPageName(this.form.pageItemList[0].title);
      } else if (index > 0 && index >= this.form.listArray.length) {
        this.form.pageItemList.push(this.form.listArray[index - 1]);
        this.setPageName(this.form.pageItemList[0].title);
      } else if (this.form.listArray.length == 0) {
        let page = this.newListItem();
        this.form.listArray.push(page);
        this.form.pageItemList.push(page);
        this.setPageName("pages");
      }
    },
    setPageName(name) {
      this.tabMenu[0].label = name;
    },
    submit() {
      this.yulanform = {
        schema_info: {
          pages: []
        }
      };
      this.yulanform.schema_info.pages = this.form.listArray;
      if (this.yulanform.schema_info.pages.length > 0) {
        this.yulanActiveName = this.yulanform.schema_info.pages[0].id;
      }
      this.showForm = 1;
    },
    onSubmit() {
      console.log("提交");
      this.innerVisible = true;
    },
    async onSure() {
      let params = {
        offset: 1,
        length: 5,
        branch: "trunk"
      };
      let data = {
        schema_info: this.yulanform.schema_info
      };
      try {
        const res = await onSubmitActiveModelCfgData(params, data);

        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "提交成功！"
          });
        }
        this.deepInnerVisible = false;
        this.innerVisible = false;
        this.$emit("closeDialog");
      } catch (error) {
        this.$message({
          type: "error",
          message: "提交失败！"
        });
        this.deepInnerVisible = false;
        this.innerVisible = false;
      }
    },
    changeShowForm(msg) {
      console.log(msg);
      this.showForm = msg;
    },
    changeindex(msg) {
      this.$emit("NewIndex", msg);
    }
  }
};
</script>

<style scoped lang="scss">
.cel-from-header {
  padding: 30px 20px 0 20px;
}
.outTabs {
  .el-tab-pane {
    background-color: #f3f3f3;
    padding: 10px 0 10px 0;
  }
}
::v-deep {
  .el-form-item__label {
    padding-left: 20px;
  }
}
.dropown {
  ::v-deep {
    .el-dropdown-menu__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
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
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  background: #8184fc;
  color: #fff;
  border-radius: 2px;
}
.browse_dialog {
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
</style>
