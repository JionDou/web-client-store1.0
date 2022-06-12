<template>
  <div>
    <section class="cel-from-header" v-if="showForm == 0">
      <el-form label-position="left" label-width="100px">
        <el-form-item label="表单模板名称">
          <el-input
            placeholder
            style="width:100%"
            v-model="form.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板ID">
          <el-input placeholder style="width:100%" v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            placeholder
            style="width:100%"
            v-model="form.desc"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-tabs
        v-model="outActiveName"
        type="card"
        :tab-position="tabPosition"
        class="outTabs"
        style="padding:0 20px;"
        @tab-click="handleOutTabClick"
      >
        <template v-for="item in tabMenu">
          <!-- common start -->
          <el-tab-pane
            v-if="item.name !== 'pages'"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          >
            <el-tabs
              v-model="activeName"
              type="card"
              @tab-click="handleClick"
              style="padding:30px 20px;"
            >
              <el-tab-pane class="firstPanel" label="常规配置" name="first">
                <section>
                  <el-card
                    class="box-card"
                    style="width: 100%;min-height: 150px;margin-top: 10px;"
                    v-for="(item, i) in form.inputArray"
                    :key="i"
                  >
                    <template>
                      <el-form label-position="right" label-width="60px">
                        <el-tag style="margin-right:8px;">{{ i + 1 }}</el-tag>
                        <el-form-item
                          label="标题"
                          style="position: relative;top: -38px;left:40px;"
                        >
                          <el-input
                            v-if="form.inputArray[i].cfg_type != 'number'"
                            placeholder="请输入标题"
                            v-model="form.inputArray[i].title"
                            clearable
                            style="width: 52%;"
                          ></el-input>
                          <el-select
                            v-model="form.inputArray[i].cfg_type"
                            placeholder="组件类型选择"
                            style="width: 34%;margin-left:45px;"
                          >
                            <el-option
                              v-for="item in options"
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
                            v-model="form.inputArray[i].id"
                            style="width: 52%;margin-right:8px;"
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
                            v-model="form.inputArray[i].desc"
                            style="width:95%;"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="默认值"
                          style="position: relative;top: -56px;left:40px;"
                        >
                          <el-input
                            class="inputStyle"
                            type="input"
                            placeholder="默认值"
                            clearable
                            v-model="form.inputArray[i].default"
                            style="width:95%;"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="可选项"
                          v-if="form.inputArray[i].cfg_type == 'single_select'"
                          style="position: relative;top:-65px;left:40px;"
                        >
                          <div
                            class="selectMayStyle"
                            style="color:grey;border: 1px solid #ddd;border-radius: 4px;width:95%;"
                          >
                            <div
                              v-for="(item, j) in form.inputArray[i].enum"
                              :key="j"
                            >
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
                              style="display: flex;align-items: center;justify-content: flex-end;margin-right:3px;"
                            >
                              <el-button
                                type="text"
                                @click="addSingleSelect(i)"
                              >
                                <i
                                  class="el-icon-circle-plus-outline"
                                  style="font-size: 20px;margin-top: 10px;"
                                ></i>
                              </el-button>
                              <el-button
                                type="text"
                                @click="deleteSingleSelect(i)"
                              >
                                <i
                                  class="el-icon-remove-outline"
                                  style="font-size: 20px;margin-top: 10px"
                                ></i>
                              </el-button>
                            </div>
                          </div>
                        </el-form-item>
                      </el-form>
                    </template>
                    <!-- 常规配置 -->
                  </el-card>
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
                        @click="adddiv(form.inputArray)"
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
                        @click="delectdiv(form.inputArray)"
                        style="font-size: 30px;"
                      >
                        <i class="el-icon-remove"></i>
                      </el-button>
                    </el-tooltip>
                  </div>
                  <!-- 添加，删除组件按钮 end -->
                </section>
              </el-tab-pane>
              <el-tab-pane label="节点配置">
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
            </el-tabs>
            <!-- {{ item.value }} -->
          </el-tab-pane>
          <!-- common end -->
          <el-tab-pane
            v-else
            :key="item.name"
            :label="item.name"
            :name="item.name"
            style="padding:30px 20px;"
          >
            <span slot="label">
              <i
                class="el-icon-d-caret"
                style="position:relative;left:53px;"
              ></i>
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
                    <!-- <el-row style="">
                    <el-button type="text" @click="deletePageCard(item, i)">
                      <i
                        class="el-icon-remove-outline"
                        style="font-size: 15px;margin-top: 10px;"
                      ></i>
                    </el-button>
                    </el-row> -->
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
              v-for="(item, i) in form.pageItemList"
              :key="i"
            >
              <template>
                <el-form label-position="right" label-width="60px">
                  <!-- <el-tag style="margin-right:8px;">{{ i + 1 }}</el-tag> -->
                  <el-tooltip
                    class="item"
                    effect="light"
                    content="删除pages"
                    placement="right"
                  >
                    <el-button
                      type="text"
                      @click="deletePageCard(item, i)"
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
                      v-model="item.title"
                      clearable
                      style="width:54%;"
                    ></el-input>
                    <el-select
                      v-model="item.cfg_type"
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
                      v-model="item.id"
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
                      v-model="item.desc"
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
                    <el-card
                      class="box-card"
                      style="width: 100%;min-height: 150px;margin-top: 10px;"
                      v-for="(item, i) in form.pageItemList[0].properties"
                      :key="i"
                    >
                      <template>
                        <el-form label-position="right" label-width="60px">
                          <el-tag style="margin-right:8px;">{{ i + 1 }}</el-tag>
                          <el-form-item
                            label="标题"
                            style="position: relative;top: -38px;left:40px;"
                          >
                            <el-input
                              v-if="item.cfg_type != 'number'"
                              placeholder="请输入标题"
                              v-model="item.title"
                              clearable
                              style="width: 52%;"
                            ></el-input>
                            <el-select
                              v-model="item.cfg_type"
                              placeholder="组件类型选择"
                              style="width: 34%;margin-left:45px;"
                            >
                              <el-option
                                v-for="item in options"
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
                            label="默认值"
                            style="position: relative;top: -56px;left:40px;"
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
                            v-if="item.cfg_type == 'single_select'"
                            style="position: relative;top:-65px;left:40px;"
                          >
                            <div
                              class="selectMayStyle"
                              style="color:grey;border: 1px solid #ddd;border-radius: 4px;width:95%;"
                            >
                              <div v-for="(item, j) in item.enum" :key="j">
                                <el-tag style="margin-left: 5px;">{{
                                  j + 1
                                }}</el-tag>
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
                                  @click="deleteSingleSelect(item, i)"
                                >
                                  <i
                                    class="el-icon-remove-outline"
                                    style="font-size: 20px;margin-top: 10px"
                                  ></i>
                                </el-button>
                              </div>
                            </div>
                          </el-form-item>
                        </el-form>
                      </template>
                      <div
                        class="routeManagement"
                        v-if="item.cfg_type === 'json'"
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
                      <!-- 常规配置 end-->
                    </el-card>
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
                          @click="adddiv(form.pageItemList[0].properties)"
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
                          @click="delectdiv(form.pageItemList[0].properties)"
                          style="font-size: 30px;"
                        >
                          <i class="el-icon-remove"></i>
                        </el-button>
                      </el-tooltip>
                    </div>
                    <!-- 添加，删除组件按钮 end -->
                  </section>
                </el-tab-pane>
                <el-tab-pane label="节点配置">
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
        label-position="right"
        label-width="135px"
        @on-submit="onSubmit"
        style="width:100%;padding-top:20px;"
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
            v-if="item.cfg_type === 'text'"
            clearable
            v-model="item.default"
            style="width: 85%;"
          ></el-input>

          <el-select
            v-if="item.cfg_type === 'single_select'"
            v-model="item.checkedVal"
            placeholder="请选择"
            style="width:85%"
          >
            <el-option
              v-for="(item, i) in item.enum"
              :key="i"
              :label="item.desc"
              :value="item.val"
            ></el-option>
          </el-select>
          <el-select
            v-if="item.cfg_type === 'multi_select'"
            v-model="item.checkedVal"
            multiple
            placeholder="请选择"
            style="width:85%"
          >
            <el-option
              v-for="(item, i) in item.enum"
              :key="i"
              :label="item.desc"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-tabs
          v-model="yulanActiveName"
          :tab-position="tabPosition"
          @tab-click="handleClick"
          type="card"
          class="outTabs"
          style="padding:10px 20px;"
        >
          <el-tab-pane
            v-for="(item, index) in this.yulanform.schema_info.pages"
            :key="index"
            :label="item.title"
            :name="item.id"
          >
            <template v-if="item.cfg_type == 'object'">
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
                  v-if="item.cfg_type === 'text' && item.val_type !== 'json'"
                  v-model="item.default"
                  type="input"
                  :placeholder="item.placeholder"
                  style="width:40%;"
                ></el-input>
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
                  ></el-option>
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
                        v-if="
                          item.val_type === 'string' ||
                            item.val_type === 'number'
                        "
                        v-model="item.default"
                        type="input"
                        :placeholder="item.placeholder"
                        style="width:40%;margin-bottom:8px;"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 完成任务条件end -->
                <template v-if="item.cfg_type == 'json'">
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
// import NodeEditorDialog from "@/components/TaskTable/common/NodeEditorDialog";
import { getModelFromData, onSubmitModelFromData } from "@/api/task";
export default {
  name: "EditFromModel",
  components: {
    // NodeEditorDialog,
    vueJsonEditor
  },
  data() {
    return {
      tabMenu: [
        {
          label: "common",
          name: "common"
        },
        {
          label: "pages",
          name: "pages"
        }
      ],
      activeName: "common",
      selected: "",
      innerVisible: false,
      deepInnerVisible: false,
      activeName: "first",
      outActiveName: "common",
      yulanActiveName: 0,
      showForm: 0,
      tabPosition: "left",
      comment: "",
      //卡片的个数
      num: 1,
      //组件选择框
      options: [
        {
          value: "input",
          label: "文本"
        },
        {
          value: "number",
          label: "数字"
        },
        {
          value: "refer",
          label: "参照"
        },
        {
          value: "single_select",
          label: "下拉选择"
        },
        {
          value: "string",
          label: "字符串"
        },
        {
          value: "array",
          label: "数组"
        }
        // {
        //   value: "radio",
        //   label: "单选按钮"
        // },
        // {
        //   value: "checkbox",
        //   label: "多选按钮"
        // },
        // {
        //   value: "multi_select",
        //   label: "多项下拉选择"
        // },
        // {
        //   value: "datetime",
        //   label: "日期时间"
        // },
        // {
        //   value: "datetimerange",
        //   label: "日期时间范围"
        // }
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
        title: "",
        desc: "",
        cfg_type: "",
        id: "",
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
  mounted() {
    this.getModelFromData();
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
        cfg_type: "",
        id: "",
        title: "",
        properties: [this.newListChildItem()]
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
        cfg_type: "",
        id: "",
        desc: "",
        title: "",
        default: "0",
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
    handleCommand(index) {
      console.log(index);
      if (this.outActiveName !== "pages") {
        this.outActiveName = "pages";
      }
      this.selected = index;
      this.form.pageItemList = [];
      this.form.pageItemList.push(this.form.listArray[index]);
    },
    handleOutTabClick() {
      if (this.outActiveName != "pages" || this.form.pageItemList.length == 0) {
        this.form.pageItemList = [];
        this.form.pageItemList.push(this.newListItem());
      }
    },
    async getModelFromData() {
      const res = await getModelFromData();
      this.version = res.data.version;
      console.log(this.version);
      this.time = res.data.time;
      this.author = res.data.author;
      console.log(this.time);

      let schemaData = res.data.schema_info;
      this.form.inputArray = schemaData.common.properties;
      this.form.listArray = schemaData.pages;
      this.form.listArray.forEach(element => {
        // if (element.hasOwnProperty("default")) {
        //   let def = JSON.stringify(element.default);
        //   element.default = def;
        // } else {
        //   this.$set(element, "default", "");
        // }
        // if (element.hasOwnProperty("properties")) {
        //   element.properties.forEach(element => {
        //     if (
        //       element.val_type === "json" &&
        //       element.hasOwnProperty("default")
        //     ) {
        //       let def = JSON.stringify(element.default);
        //       element.default = def;
        //     } else if (!element.hasOwnProperty("default")) {
        //       this.$set(element, "default", "");
        //     }
        //   });
        // }
      });
      if (this.form.listArray.length > 0) {
        this.form.pageItemList = [];
        this.form.pageItemList.push(this.form.listArray[0]);
      }
      console.log(this.form.inputArray);
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
      this.form.listArray[i].enum.push(this.newEnumItem());
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
    deletePageCard(item, i) {
      console.log(item);
      this.form.listArray.splice(i, 1);
      this.form.pageItemList.pop(this.form.listArray[i]);

      // let len = this.form.listArray.length;
      // if (item == this.form.pageItemList[0]) {
      //   this.form.pageItemList = [];
      //   if (len == 0) {
      //     return;
      //   }
      //   if (i == len) {
      //     this.form.pageItemList.push(this.form.listArray[len - 1]);
      //   } else {
      //     this.form.pageItemList.push(this.form.listArray[i]);
      //   }
      // }
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
            default: ""
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
    onSubmit() {
      console.log("提交");
      this.innerVisible = true;
    },
    async onSure() {
      let params = {
        time: this.time,
        schema_info: this.yulanform.schema_info,
        version: this.version,
        author: this.author,
        comment: this.comment
      };
      try {
        const res = await onSubmitModelFromData(params);
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "提交成功！"
          });
        }
        this.deepInnerVisible = false;
        this.innerVisible = false;
        // this.$emit("editFormModel", (dialog.visible = false));
      } catch (error) {
        this.$message({
          type: "error",
          message: "提交失败！"
        });
        this.deepInnerVisible = false;
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
// .list-card {
//   span {
//     display: block;
//     text-align: center;
//     font-size: 14px;
//     font-weight: 400;
//     color: #333;
//     margin-bottom: 5px;
//   }
//   .el-button {
//     margin-left: 60px;
//   }
// }
</style>
