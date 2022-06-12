<template>
  <div>
    <section v-if="showForm == 0" class="cel-from-header">
      <el-form label-position="left" label-width="100px">
        <el-form-item label="表单模板名称">
          <el-input v-model="form.title" placeholder style="width:100%" />
        </el-form-item>
        <el-form-item label="模板ID">
          <el-input v-model="form.id" placeholder style="width:100%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc" type="textarea" placeholder style="width:100%" />
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
              style="padding:30px 20px;"
              @tab-click="handleClick"
            >
              <el-tab-pane class="firstPanel" label="常规配置" name="first">
                <section>
                  <draggable
                    v-model="form.inputArray"
                    class="list-group"
                    tag="ul"
                    v-bind="dragOptions"
                    @start="isDragging = true"
                    @end="isDragging = false"
                  >
                    <!-- <transition-group type="transition" name="flip-list"> -->
                    <el-card
                      v-for="(item, i) in form.inputArray"
                      :key="i"
                      class="box-card"
                      style="width: 100%;min-height: 150px;margin-top: 10px;background:antiquewhite;"
                    >
                      <template>
                        <el-form label-position="right" label-width="60px">
                          <el-tag style="margin-right:8px;">{{ i + 1 }}</el-tag>
                          <el-form-item label="标题" style="position: relative;top: -38px;left:40px;">
                            <el-input
                              v-if="form.inputArray[i].cfg_type !== 'number'"
                              v-model="form.inputArray[i].title"
                              placeholder="请输入标题"
                              clearable
                              style="width: 52%;"
                            />
                            <el-select
                              v-model="form.inputArray[i].cfg_type"
                              placeholder="组件类型选择"
                              style="width: 39%;margin-left:52px;"
                              @change="changeItemType(item)"
                            >
                              <el-option
                                v-for="item in cfgTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                          <el-form-item
                            label="ID字段"
                            style="position: relative;top: -47px;left:40px;"
                          >
                            <el-input
                              v-model="form.inputArray[i].id"
                              class="inputStyle"
                              type="input"
                              placeholder="id"
                              clearable
                              style="width: 52%;margin-right:8px;"
                            />
                            <el-select
                              v-model="form.inputArray[i].val_type"
                              placeholder="组件类型选择"
                              style="width: 39%;margin-left:45px;"
                              @change="changeItemType(item)"
                            >
                              <el-option
                                v-for="item in valTypes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-form-item>
                          <el-form-item label="描述" style="position: relative;top: -56px;left:40px;">
                            <el-input
                              v-model="form.inputArray[i].desc"
                              class="inputStyle"
                              type="input"
                              placeholder="描述"
                              clearable
                              style="width:95%;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="默认值"
                            style="position: relative;top: -56px;left:40px;"
                          >
                            <el-input
                              v-if="item.val_type === 'number'"
                              v-model.number="form.inputArray[i].default"
                              class="inputStyle"
                              type="number"
                              placeholder="默认值"
                              clearable
                              style="width:95%;"
                            />
                            <el-input
                              v-if="item.val_type !== 'number'"
                              v-model="form.inputArray[i].default"
                              class="inputStyle"
                              type="input"
                              placeholder="默认值"
                              clearable
                              style="width:95%;"
                            />
                          </el-form-item>
                          <el-form-item
                            v-if="
                              form.inputArray[i].cfg_type == 'single_select'
                            "
                            label="可选项"
                            style="position: relative;top:-65px;left:40px;"
                          >
                            <div
                              class="selectMayStyle"
                              style="color:grey;border: 1px solid #ddd;border-radius: 4px;width:95%;"
                            >
                              <div v-for="(item, j) in form.inputArray[i].enum" :key="j">
                                <el-tag style="margin-left: 5px;">{{ j + 1 }}</el-tag>
                                <el-input
                                  v-model="item.val"
                                  placeholder="标题"
                                  clearable
                                  style="width:30%;margin-left:6px;"
                                />
                                <el-input
                                  v-model="item.id"
                                  class="inputStyle"
                                  type="input"
                                  placeholder="id字段"
                                  clearable
                                  style="width:20%;margin-left:6px;"
                                />
                                <el-input
                                  v-model="item.desc"
                                  class="inputStyle"
                                  type="input"
                                  placeholder="描述"
                                  clearable
                                  style="width: 38%;margin-top:10px;margin-left:6px;"
                                />
                              </div>
                              <div
                                style="display: flex;align-items: center;justify-content: flex-end;margin-right:3px;"
                              >
                                <el-button type="text" @click="addSingleSelect(i)">
                                  <i
                                    class="el-icon-circle-plus-outline"
                                    style="font-size: 20px;margin-top: 10px;"
                                  />
                                </el-button>
                                <el-button type="text" @click="deleteSingleSelect(i)">
                                  <i
                                    class="el-icon-remove-outline"
                                    style="font-size: 20px;margin-top: 10px"
                                  />
                                </el-button>
                              </div>
                            </div>
                          </el-form-item>
                        </el-form>
                      </template>
                      <!-- 添加，删除组件按钮 -->
                      <div style="text-align: right;width:100%;margin-top: 10px;">
                        <el-tooltip class="item" effect="light" content="添加新组件" placement="top">
                          <el-button
                            type="text"
                            style="font-size: 30px;"
                            @click="adddiv(form.inputArray, i)"
                          >
                            <i class="el-icon-circle-plus" />
                          </el-button>
                        </el-tooltip>

                        <el-tooltip class="item" effect="light" content="删除组件" placement="top">
                          <el-button
                            type="text"
                            style="font-size: 30px;"
                            @click="delectdiv(form.inputArray, i)"
                          >
                            <i class="el-icon-remove" />
                          </el-button>
                        </el-tooltip>
                      </div>
                      <!-- 添加，删除组件按钮 end -->
                      <!-- 常规配置 -->
                    </el-card>
                    <!-- </transition-group> -->
                  </draggable>
                </section>
              </el-tab-pane>
              <el-tab-pane label="节点配置" />
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
              <i class="el-icon-d-caret" style="position:relative;" />
              <el-dropdown placement="bottom" trigger="click" @command="handleCommand">
                <span>{{ item.label }}</span>
                <el-dropdown-menu slot="dropdown" class="dropown">
                  <el-dropdown-item v-for="(item, i) in form.listArray" :key="i" :command="i">
                    <span>{{ item.title }}</span>
                  </el-dropdown-item>
                  <el-row style="display: flex;align-items: center;justify-content: center;">
                    <el-tooltip class="item" effect="light" content="添加pages" placement="bottom">
                      <el-button type="text" style="font-size: 20px;" @click="addPageCard">
                        <i class="el-icon-circle-plus" />
                      </el-button>
                    </el-tooltip>
                  </el-row>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
            <el-card
              v-for="(page, i) in form.pageItemList"
              :key="i"
              class="box-card"
              style="width: 100%;min-height: 150px;padding-top:53px;background:antiquewhite;"
            >
              <template>
                <el-form label-position="right" label-width="60px">
                  <el-tooltip class="item" effect="light" content="删除pages" placement="right">
                    <el-button
                      type="text"
                      style="position:absolute;top:24px;"
                      @click="deletePageCard(page)"
                    >
                      <i class="el-icon-remove-outline" style="font-size:20px;margin-top: 10px;" />
                    </el-button>
                  </el-tooltip>
                  <el-form-item label="标题" style="position: relative;top: -38px;left:40px;">
                    <el-input v-model="page.title" placeholder="请输入标题" clearable style="width:54%;" />
                    <el-select
                      v-model="page.cfg_type"
                      placeholder="组件类型选择"
                      style="width: 39%;margin-left:45px;"
                      @change="changePageItemType(page)"
                    >
                      <el-option
                        v-for="item in listTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="ID字段" style="position: relative;top: -47px;left:40px;">
                    <el-input
                      v-model="page.id"
                      class="inputStyle"
                      type="input"
                      placeholder="id"
                      clearable
                      style="width:54%;margin-right:8px;"
                    />
                  </el-form-item>
                  <el-form-item label="描述" style="position: relative;top: -56px;left:40px;">
                    <el-input
                      v-model="page.desc"
                      class="inputStyle"
                      type="input"
                      placeholder="描述"
                      clearable
                      style="width:95%;"
                    />
                  </el-form-item>
                </el-form>
              </template>
              <el-tabs
                v-model="activeName"
                type="card"
                style="padding:30px 20px;"
                @tab-click="handleClick"
              >
                <el-tab-pane class="firstPanel" label="常规配置" name="first">
                  <section>
                    <template v-if="page.cfg_type !== 'json'">
                      <draggable
                        v-model="form.pageItemList[0].properties"
                        class="list-group"
                        tag="ul"
                        v-bind="dragOptions"
                        @start="isDragging = true"
                        @end="isDragging = false"
                      >
                        <!-- <transition-group type="transition" name="flip-list"> -->
                        <el-card
                          v-for="(item, i) in form.pageItemList[0].properties"
                          :key="item.index"
                          class="box-card"
                          style="width: 100%;min-height: 150px;margin-top: 10px;background:antiquewhite;"
                        >
                          <template>
                            <el-form label-position="right" label-width="60px">
                              <el-tag style="margin-right:8px;">{{ i + 1 }}</el-tag>
                              <el-form-item
                                label="标题"
                                style="position: relative;top: -38px;left:40px;"
                              >
                                <el-input
                                  v-model="item.title"
                                  placeholder="请输入标题"
                                  clearable
                                  style="width: 52%;"
                                />
                                <el-select
                                  v-model="item.cfg_type"
                                  placeholder="组件类型选择"
                                  style="width: 39%;margin-left:53px;"
                                >
                                  <el-option
                                    v-for="item in cfgTypes"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  />
                                </el-select>
                              </el-form-item>
                              <el-form-item
                                label="ID字段"
                                style="position: relative;top: -47px;left:40px;"
                              >
                                <el-input
                                  v-model="item.id"
                                  class="inputStyle"
                                  type="input"
                                  placeholder="id"
                                  clearable
                                  style="width: 52%;margin-right:8px;"
                                />
                                <el-select
                                  v-if="item.cfg_type !== 'object'"
                                  v-model="item.val_type"
                                  placeholder="组件类型选择"
                                  style="width: 39%;margin-left:45px;"
                                  clearable
                                  @change="changeInputItemType(item)"
                                >
                                  <el-option
                                    v-for="item in valTypes"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                  />
                                </el-select>
                              </el-form-item>
                              <el-form-item
                                label="描述"
                                style="position: relative;top: -56px;left:40px;"
                              >
                                <el-input
                                  v-model="item.desc"
                                  class="inputStyle"
                                  type="input"
                                  placeholder="描述"
                                  clearable
                                  style="width:95%;"
                                />
                              </el-form-item>
                              <el-form-item
                                v-if="item.val_type === 'number'"
                                label="默认值"
                                style="position: relative;top: -56px;left:40px;"
                              >
                                <el-input
                                  v-model.number="item.default"
                                  class="inputStyle"
                                  type="number"
                                  placeholder="默认值"
                                  clearable
                                  style="width:95%;"
                                />
                              </el-form-item>
                              <el-form-item
                                v-if="
                                  item.val_type !== 'number' &&
                                    item.val_type !== 'json'
                                "
                                label="默认值"
                                style="position: relative;top: -56px;left:40px;"
                              >
                                <el-input
                                  v-model="item.default"
                                  class="inputStyle"
                                  type="input"
                                  placeholder="默认值"
                                  clearable
                                  style="width:95%;"
                                />
                              </el-form-item>
                              <el-form-item
                                v-if="
                                  item.cfg_type == 'single_select' ||
                                    item.cfg_type === 'multi_select'
                                "
                                label="可选项"
                                style="position: relative;top:-65px;left:40px;"
                              >
                                <div
                                  class="selectMayStyle"
                                  style="color:grey;border: 1px solid #ddd;border-radius: 4px;width:95%;"
                                >
                                  <div v-for="(item, j) in item.enum" :key="j">
                                    <el-tag style="margin-left: 5px;">
                                      {{
                                        j + 1
                                      }}
                                    </el-tag>
                                    <el-input
                                      v-model="item.val"
                                      placeholder="标题"
                                      clearable
                                      style="width:30%;margin-left:6px;"
                                    />
                                    <el-input
                                      v-model="item.id"
                                      class="inputStyle"
                                      type="input"
                                      placeholder="id字段"
                                      clearable
                                      style="width:20%;margin-left:6px;"
                                    />
                                    <el-input
                                      v-model="item.desc"
                                      class="inputStyle"
                                      type="input"
                                      placeholder="描述"
                                      clearable
                                      style="width: 38%;margin-top:10px;margin-left:6px;"
                                    />
                                  </div>
                                  <div
                                    style="display: flex;align-items:center;justify-content:flex-end;margin-right:3px;"
                                  >
                                    <el-button type="text" @click="addSingleListSelect(item, i)">
                                      <i
                                        class="el-icon-circle-plus-outline"
                                        style="font-size: 20px;margin-top: 10px;"
                                      />
                                    </el-button>
                                    <el-button type="text" @click="deleteSingleListSelect(item, i)">
                                      <i
                                        class="el-icon-remove-outline"
                                        style="font-size: 20px;margin-top: 10px"
                                      />
                                    </el-button>
                                  </div>
                                </div>
                              </el-form-item>
                              <div
                                v-if="item.val_type === 'json' || item.cfg_type === 'json'"
                                class="routeManagement"
                                style="position: relative;top:-59px;left:23px"
                              >
                                <vue-json-editor
                                  v-model="item.default"
                                  :show-btns="false"
                                  lang="zh"
                                  @json-change="onJsonChange"
                                  @json-save="onJsonSave"
                                />
                              </div>
                            </el-form>
                          </template>
                          <!-- 添加，删除组件按钮 -->
                          <div style="text-align: right;width:100%;margin-top: 10px;">
                            <el-tooltip class="item" effect="light" content="添加新组件" placement="top">
                              <el-button
                                type="text"
                                style="font-size: 30px;"
                                @click="
                                  adddiv(form.pageItemList[0].properties, i)
                                "
                              >
                                <i class="el-icon-circle-plus" />
                              </el-button>
                            </el-tooltip>

                            <el-tooltip class="item" effect="light" content="删除组件" placement="top">
                              <el-button
                                type="text"
                                style="font-size: 30px;"
                                @click="
                                  delectdiv(form.pageItemList[0].properties, i)
                                "
                              >
                                <i class="el-icon-remove" />
                              </el-button>
                            </el-tooltip>
                          </div>
                          <!-- 添加，删除组件按钮 end -->
                        </el-card>
                        <!-- </transition-group> -->
                      </draggable>
                    </template>
                    <el-card
                      v-if="page.val_type === 'json' || page.cfg_type === 'json'"
                      class="box-card"
                      style="width: 100%;min-height: 150px;margin-top: 10px;"
                    >
                      <div class="routeManagement" style="position: relative;top: -23px;">
                        <vue-json-editor
                          v-model="page.default"
                          :show-btns="false"
                          lang="zh"
                          @json-change="onJsonChange"
                          @json-save="onJsonSave"
                        />
                      </div>
                    </el-card>
                    <!-- 常规配置 end-->
                  </section>
                </el-tab-pane>
                <el-tab-pane label="节点配置" />
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
        style="width:100%;padding-top:20px;"
        @on-submit="onSubmit"
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
            />
          </el-tooltip>
          <el-input
            v-if="item.val_type === 'string'"
            v-model="item.default"
            clearable
            style="width: 85%;"
          />
          <el-input
            v-if="item.val_type === 'number'"
            v-model.number="item.default"
            type="number"
            clearable
            style="width: 85%;"
          />
          <el-select
            v-if="item.cfg_type === 'single_select'"
            v-model="item.default"
            placeholder="请选择"
            style="width:85%"
          >
            <el-option v-for="(item, i) in item.enum" :key="i" :label="item.desc" :value="item.val" />
          </el-select>
          <el-select
            v-if="item.cfg_type === 'multi_select'"
            v-model="item.default"
            multiple
            placeholder="请选择"
            style="width:85%"
          >
            <el-option v-for="(item, i) in item.enum" :key="i" :label="item.desc" :value="item.val" />
          </el-select>
        </el-form-item>

        <el-tabs
          v-model="yulanActiveName"
          :tab-position="tabPosition"
          type="card"
          class="outTabs"
          style="margin:10px 20px;"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="(item, index) in this.yulanform.schema_info.pages"
            :key="index"
            :label="item.title"
            :name="item.id"
          >
            <template v-if="item.cfg_type == 'object'">
              <el-form-item v-for="(item, i) in item.properties" :key="i" :label="item.title">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.desc ? item.desc : ' '"
                  placement="left-end"
                >
                  <i
                    class="el-icon-warning-outline"
                    style="display: inline-block;font-size:18px;margin-right:10px;"
                  />
                </el-tooltip>
                <el-input
                  v-if="item.val_type === 'number'"
                  v-model.number="item.default"
                  type="number"
                  clearable
                  style="width: 70%;"
                />
                <el-input
                  v-if="
                    item.val_type === 'refer' &&
                      item.cfg_type !== 'single_select'
                  "
                  v-model.number="item.default"
                  type="input"
                  clearable
                  style="width: 70%;"
                />
                <el-input
                  v-if="item.val_type === 'string' && item.val_type !== 'json'"
                  v-model="item.default"
                  type="input"
                  :placeholder="item.placeholder"
                  style="width:70%;"
                />
                <el-select
                  v-if="item.cfg_type === 'single_select'"
                  v-model="item.default"
                  placeholder="请选择"
                  style="width:70%;"
                >
                  <el-option
                    v-for="item in item.enum"
                    :key="item.id"
                    :label="item.desc"
                    :value="item.val"
                  />
                </el-select>
                <!-- 完成任务条件 -->
                <el-row style="margin-left:-110px;">
                  <el-col :span="24">
                    <el-form-item
                      v-for="(item, i) in item.properties"
                      :key="i"
                      :label="item.title"
                      class="finish"
                    >
                      <el-input
                        v-if="item.val_type === 'number'"
                        v-model.number="item.default"
                        clearable
                        type="number"
                        :placeholder="item.placeholder"
                        style="width:72.5%;margin-bottom:8px;"
                      />
                      <el-input
                        v-if="item.val_type === 'string'"
                        v-model="item.default"
                        clearable
                        type="input"
                        :placeholder="item.placeholder"
                        style="width:72.5%;margin-bottom:8px;"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 完成任务条件end -->
                <template v-if="item.val_type == 'json'">
                  <json-viewer
                    :value="item.default"
                    :expand-depth="5"
                    copyable
                    boxed
                    sort
                    style="position:relative; width:73.5%;margin-bottom:20px;"
                  />
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
              />
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
            :show-btns="false"
            lang="zh"
            @json-change="onJsonChange"
            @json-save="onJsonSave"
          />
        </div>
        <div style="display: flex;align-items: center;justify-content: flex-end;">
          <el-dialog width="30%" title="comment" :visible.sync="deepInnerVisible" append-to-body>
            <el-input v-model="comment" type="textarea" placeholder />
            <el-row>
              <el-col
                :span="24"
                style="display: flex;align-items: center;justify-content: flex-end;margin-top: 10px;"
              >
                <el-button type="success" size="mini" @click="onSure">确定</el-button>
              </el-col>
            </el-row>
          </el-dialog>
          <el-button size="medium" @click="innerVisible = false">取 消</el-button>
          <el-button
            type="success"
            size="medium"
            style="margin-right:10px;"
            @click="deepInnerVisible = true"
          >提交
          </el-button>
        </div>
      </el-dialog>
      <div style="text-align:center; padding-bottom:20px;">
        <el-button type="primary" @click="changeShowForm(0)">返回修改</el-button>
        <el-button type="primary" @click="onSubmit(yulanform)">立即发布</el-button>
      </div>
    </section>
    <!-- 表单模板预览页面 end-->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import vueJsonEditor from 'vue-json-editor'
import { getSchema, onSubmitSchema } from '@/api/m-Activity'

export default {
  name: 'CustomTemplate',
  components: {
    vueJsonEditor,
    draggable
  },
  data() {
    return {
      tabMenu: [
        {
          label: 'common',
          name: 'common'
        },
        {
          label: 'pages',
          name: 'pages'
        }
      ],
      activeName: 'common',
      selected: '',
      innerVisible: false,
      deepInnerVisible: false,
      activeName: 'first',
      outActiveName: 'common',
      yulanActiveName: 0,
      showForm: 0,
      tabPosition: 'left',
      comment: '',
      // 卡片的个数
      num: 1,
      // 组件选择框
      cfgTypes: [
        {
          value: 'text',
          label: 'text'
        },
        {
          value: 'single_select',
          label: 'single_select'
        },
        {
          value: 'multi_select',
          label: 'multi_select'
        },
        {
          value: 'object',
          label: 'object'
        },
        {
          value: 'array',
          label: 'array'
        }
      ],
      valTypes: [
        {
          value: 'string',
          label: 'string'
        },
        {
          value: 'number',
          label: 'number'
        },
        {
          value: 'json',
          label: 'json'
        },
        {
          value: 'refer',
          label: 'refer'
        },
        {
          value: 'object',
          label: 'object'
        }
      ],
      // 列表选择框
      listTypes: [
        {
          value: 'object',
          label: 'Object'
        },
        {
          value: 'json',
          label: 'JSON'
        },
        {
          value: 'array',
          label: 'Array'
        }
      ],
      // 表单实例对象
      yulanform: {},
      option: {
        submitBtn: {
          show: false
        }
      },
      form: {
        title: '公共',
        cfg_type: 'object',
        id: 'common',
        pageName: 'pages',
        pageItemIndex: 0,
        pageItem: '',
        version: '',
        time: '',
        pageItemList: [this.newListItem()],
        listArray: [this.newListItem()],
        inputArray: [this.newSelectItem()]
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  mounted() {
    this.getSchema()
  },
  methods: {
    onJsonChange() {
    },
    onJsonSave() {
    },
    handleClick() {
      console.log('handleClick')
    },
    // 增加组件
    adddiv(array) {
      array.push(this.newListChildItem())
    },
    adddiv(array, pos) {
      array.splice(pos + 1, 0, this.newListChildItem())
    },
    newListItem() {
      return {
        val_type: '',
        cfg_type: '',
        id: '',
        title: '',
        properties: [this.newListChildItem()]
      }
    },
    newListChildItem() {
      return {
        id: '',
        val_type: '',
        cfg_type: '',
        title: '',
        default: null,
        desc: ''
      }
    },
    newSelectItem() {
      return {
        val_type: '',
        cfg_type: '',
        id: '',
        desc: '',
        title: '',
        default: null,
        enum: [this.newEnumItem()]
      }
    },
    newEnumItem() {
      return {
        id: '',
        val: '',
        desc: ''
      }
    },
    changePageItemType(item) {
      console.log(item)
      if (item.cfg_type === 'json') {
        item.default = ''
        if (item.properties) {
          this.$delete(item, 'properties')
        }
      } else {
        item.properties = [this.newListChildItem()]
        if (item.default) {
          this.$delete(item, 'default')
        }
      }
    },
    changeItemType(item) {
      if (item.val_type === 'number' || item.cfg_type === 'text') {
        if (item.enum) {
          this.$delete(item, 'enum')
        }
      } else if (!item.enum) {
        this.$set(item, 'enum', [])
      }
    },
    changeInputItemType(item) {
      if (item.cfg_type === 'json' || item.val_type === 'json') {
        item.default = ''
        if (item.enum) {
          this.$delete(item, 'enum')
        }
      } else if (item.val_type === 'number') {
        item.default = ''
        if (item.enum) {
          this.$delete(item, 'enum')
        }
      } else if (item.val_type === 'string') {
        item.default = ''
        if (item.enum) {
          this.$delete(item, 'enum')
        }
      } else {
        item.default = null
        if (!item.enum) {
          this.$set(item, 'enum', [])
        }
      }
      // // 清空选项,并且新增一个空对象
      // if (item.enum) {
      //   item.enum = [];
      //   item.enum.push(this.newEnumItem());
      // }
    },
    handleCommand(index) {
      if (this.outActiveName !== 'pages') {
        this.outActiveName = 'pages'
      }
      this.selected = index
      this.form.pageItemList = []
      this.form.pageItemList.push(this.form.listArray[index])
      this.setPageName(this.form.pageItemList[0].title)
    },
    handleOutTabClick() {
      if (this.outActiveName != 'pages' || this.form.pageItemList.length == 0) {
        this.form.pageItemList = []
        this.form.pageItemList.push(this.newListItem())
      }
    },
    async getSchema() {
      const activity = this.$route.meta.activity
      const res = await getSchema(activity)
      this.version = res.data.version
      this.time = res.data.time
      this.author = res.data.author

      const schemaData = res.data.schema_info
      this.form.inputArray = schemaData.common.properties
      this.form.listArray = schemaData.pages
      console.log(this.form.listArray)
      if (this.form.listArray.length > 0) {
        this.form.pageItemList = []
        this.form.pageItemList.push(this.form.listArray[0])
      }
    },
    // 删除组件
    delectdiv(array) {
      if (array.length > 1) {
        array.pop()
      }
    },
    // 从指定位置删除组件
    delectdiv(array, pos) {
      if (array.length > 1) {
        array.splice(pos, 1)
      }
    },
    // 增加下拉框选项
    addSingleSelect(i) {
      this.form.inputArray[i].enum.push(this.newEnumItem())
    },
    addSingleListSelect(i) {
      if (!i.enum) {
        i.enum = []
      }
      i.enum.push(this.newEnumItem())
    },
    deleteSingleListSelect(i) {
      if (!i.enum) {
        i.enum = []
      }
      i.enum.pop(this.newEnumItem())
    },
    deleteSingleSelect(i) {
      this.form.inputArray[i].enum.pop()
    },
    addMultiSelect(i) {
      this.form.inputArray[i].enum.push(this.newEnumItem())
    },
    deleteMultiSelect(i) {
      this.form.inputArray[i].enum.pop()
    },
    addListArrayItem(i) {
      this.form.listArray[i].properties.push(this.newListChildItem())
    },
    deleteListArrayItem(i) {
      this.form.listArray[i].properties.pop()
    },
    // 增加组件
    addListCard() {
      this.form.listArray.push(this.newListItem())
    },
    // 删除组件
    deleteListCard() {
      if (this.form.listArray.length > 1) {
        this.form.listArray.pop()
      }
    },
    addPageCard() {
      const item = this.newListItem()
      this.form.listArray.push(item)
      this.form.pageItemList = []
      this.form.pageItemList.push(item)
    },
    deletePageCard(item) {
      const index = this.form.listArray.indexOf(item)
      this.form.listArray.splice(index, 1)
      this.form.pageItemList = []
      if (index < this.form.listArray.length) {
        this.form.pageItemList.push(this.form.listArray[index])
        this.setPageName(this.form.pageItemList[0].title)
      } else if (index > 0 && index >= this.form.listArray.length) {
        this.form.pageItemList.push(this.form.listArray[index - 1])
        this.setPageName(this.form.pageItemList[0].title)
      } else if (this.form.listArray.length == 0) {
        const page = this.newListItem()
        this.form.listArray.push(page)
        this.form.pageItemList.push(page)
        this.setPageName('pages')
      }
    },
    setPageName(name) {
      this.tabMenu[1].label = name
    },
    submit() {
      this.yulanform = {
        schema_info: {
          common: {
            val_type: this.form.val_type,
            cfg_type: this.form.cfg_type,
            title: this.form.title,
            id: this.form.id,
            desc: this.form.desc,
            properties: []
          },
          pages: []
        }
      }
      for (let i = 0; i < this.form.inputArray.length; i++) {
        if (
          this.form.inputArray[i].cfg_type == 'radio' ||
            this.form.inputArray[i].cfg_type == 'single_select'
        ) {
          this.yulanform.schema_info.common.properties.push({
            val_type: this.form.inputArray[i].val_type,
            cfg_type: this.form.inputArray[i].cfg_type,
            title: this.form.inputArray[i].title,
            id: this.form.inputArray[i].id,
            desc: this.form.inputArray[i].desc,
            enum: this.form.inputArray[i].enum,
            default: this.form.inputArray[i].enum[0].default
          })
        } else if (
          this.form.inputArray[i].cfg_type == 'multi_select' ||
            this.form.inputArray[i].cfg_type == 'multi_select'
        ) {
          const defautVal = []
          const enumTmp = []
          this.form.inputArray[i].enum.forEach((element) => {
            if (
              element.val !== null &&
                element.val !== '' &&
                element.id !== null &&
                element.id !== ''
            ) {
              defautVal.push(element.val)
              enumTmp.push(element)
            }
          })
          this.yulanform.schema_info.common.properties.push({
            val_type: this.form.inputArray[i].val_type,
            cfg_type: this.form.inputArray[i].cfg_type,
            title: this.form.inputArray[i].title,
            id: this.form.inputArray[i].id,
            desc: this.form.inputArray[i].desc,
            enum: this.form.inputArray[i].enum,
            default: defautVal
          })
        } else if (this.form.inputArray[i].cfg_type == 'datetime') {
          this.yulanform.schema_info.common.properties.push({
            cfg_type: this.form.inputArray[i].cfg_type,
            title: this.form.inputArray[i].title,
            id: this.form.inputArray[i].id,
            desc: this.form.inputArray[i].desc,
            checkedVal: this.form.inputArray[i].date
          })
        } else if (this.form.inputArray[i].cfg_type == 'datetimerange') {
          this.yulanform.schema_info.common.properties.push({
            cfg_type: this.form.inputArray[i].cfg_type,
            title: this.form.inputArray[i].title,
            id: this.form.inputArray[i].id,
            desc: this.form.inputArray[i].desc,
            checkedVal: this.form.inputArray[i].enum
          })
        } else {
          this.yulanform.schema_info.common.properties.push({
            val_type: this.form.inputArray[i].val_type,
            cfg_type: this.form.inputArray[i].cfg_type,
            title: this.form.inputArray[i].title,
            id: this.form.inputArray[i].id,
            desc: this.form.inputArray[i].desc,
            default: null
          })
        }
      }
      console.log('start.')
      console.log(this.form.listArray)
      this.yulanform.schema_info.pages = this.form.listArray
      if (this.yulanform.schema_info.pages.length > 0) {
        this.yulanActiveName = this.yulanform.schema_info.pages[0].id
        console.log(this.yulanform.schema_info.pages)
      }
      this.showForm = 1
    },
    onSubmit() {
      console.log('提交')
      this.innerVisible = true
    },
    async onSure() {
      const params = {
        time: this.time,
        schema_info: this.yulanform.schema_info,
        version: this.version,
        author: this.author,
        comment: this.comment
      }
      console.log(params)
      const type = this.$route.meta.type
      if (type === '') {
        try {
          const res = await onSubmitSchema(params)

          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '提交成功！'
            })
          }
          this.deepInnerVisible = false
          this.innerVisible = false
          this.$emit('closeDialog')
        } catch (error) {
          this.$message({
            type: 'error',
            message: '提交失败！'
          })
          this.deepInnerVisible = false
          this.innerVisible = false
        }
      }
    },
    changeShowForm(msg) {
      this.showForm = msg
    },
    changeindex(msg) {
      this.$emit('NewIndex', msg)
    }
  }
}
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

  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }

  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
</style>
