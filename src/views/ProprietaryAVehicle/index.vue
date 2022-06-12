<template>
  <div class="modelContainer">
    <component :is="activeCfgList.name" ref="activeCfgList"></component>
  </div>
</template>

<script>
import ActiveCfgList from "@/components/TaskTable/qsm/ActiveCfgList/ActiveCfgList";
export default {
  components: { ActiveCfgList },
  data() {
    return {
      activeCfgList: {
        name: "ActiveCfgList"
      }
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.ces-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 16px;
}
.modelContainer {
  width: 100%;
  border: 1px solid #ddd;
  padding: 20px 12px 150px 12px;
  border-radius: 4px;
  background: #fefefe;
  margin-top: 10px;
}
::v-deep {
  .el-table__body {
    width: 100% !important;
  }
}
</style>
