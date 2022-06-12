<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-position="right"
    label-width="120px"
  >
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
            @change="getCfgType"
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
  </el-form>
</template>

<script>
import { getModelLibraryTableData } from "@/api/table.js";
export default {
  // props: {
  //   options: {
  //     type: Array,
  //     default: []
  //   }
  // },
  data() {
    return {
      ruleForm: {
        desc: "",
        cfg_tmpl_id: ""
      },
      options: []
    };
  },
  mounted() {
    this.getModelLibraryTableData();
  },
  methods: {
    //获取端游任务类型选择数据
    async getModelLibraryTableData() {
      this.loading = true;
      const res = await getModelLibraryTableData();
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
    getCfgType() {}
  }
};
</script>

<style></style>
