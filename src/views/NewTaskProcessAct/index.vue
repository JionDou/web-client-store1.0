<template>
  <div class="modelContainer">
    <component :is="newTaskActiveList.name" ref="newTaskActiveList"></component>
  </div>
</template>

<script>
import NewTaskActiveList from "@/components/TaskTable/qsm/NewTaskActive/NewTaskActiveList";
export default {
  components: { NewTaskActiveList },
  data() {
    return {
      newTaskActiveList: {
        name: "NewTaskActiveList"
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
