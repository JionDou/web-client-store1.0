<template>
  <div>
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
    <el-form-item label="配置模板id">
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
        v-model="ruleForm.id"
        placeholder
        style="width:60%;"
        clearable
      ></el-input>
    </el-form-item>
    <el-divider content-position="left">公共部分</el-divider>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        desc: "",
        name: "",
        id: ""
      }
    };
  }
};
</script>

<style></style>
