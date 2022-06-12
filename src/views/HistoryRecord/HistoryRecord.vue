<template>
  <div class="history-record">
    <div
      class="asyncDoc"
      v-loading="loading"
      element-loading-text="刷当中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
    >
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="12">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col
              :span="12"
              style="display:flex;align-items:center;justify-content:flex-end;margin-bottom:20px;"
            >
              <el-button type="" @click="getStatus">刷档</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="12">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="同步到trunk线"></el-checkbox>
                <el-checkbox label="同步到preview线"></el-checkbox>
                <el-checkbox label="同步到publish线"></el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col
              :span="12"
              style="display:flex;align-items:center;justify-content:flex-end;"
            >
              <el-button type="">同步并提交到SVN</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      timer: "",
      options: [
        {
          value: "0",
          label: "trunk"
        },
        {
          value: "1",
          label: "31服(开发线)"
        }
      ],
      checkList: ["同步到trunk线", "同步到preview线", "同步到publish线"],
      value: "trunk",
      status: ""
    };
  },
  computed: {
    // 计算属性
    statusData() {
      return this.status;
    }
  },
  watch: {
    statusData: function(newval) {
      // 当返回的新值为创建中的时候,保持3秒轮询
      if (newval == "reloading") {
        var timer = setInterval(() => {
          setTimeout(this.getStatus, 0);
        }, 1000 * 15 * 60);
      }
      // 当返回的新值为成功的时候,关闭定时器,结束轮询
      if (newval == "success") {
        clearInterval(timer);
      }
      // 当页面关闭的时候,结束轮询,否则就会一直发请求,
      //使用$once(eventName, eventHandler)一次性监听事件
      this.$once("hook:boforeDestory", () => {
        clearInterval(timer);
      });
    }
  },
  mounted() {
    // this.timer = setInterval(this.turnTable, 1000000);
    // console.log(this.timer);
  },
  methods: {
    getStatus() {
      this.loading = true;
      axios.get("http://10.32.96.61:3457/qsm/reloading").then(res => {
        if (res.status == 200) this.$message.error("请求刷当中");
        this.status = res.data.data.status["trunk-30-2021-02-23-17:08:51"];
        console.log(this.status);
      });
    },
    async turnTable() {
      this.loading = true;
      // let params = {
      //   branch: "trunk",
      //   schema: "[315]A车免费体验活动.xlsx;特权配置",
      //   username: "joelzychen",
      //   password: "ea1084EAW",
      //   operations: [
      //     {
      //       schema: "[315]A车免费体验活动.xlsx-特权配置",
      //       content: [
      //         {
      //           row_idx: 6,
      //           活动ID: 2,
      //           特权ID: 12,
      //           特权任务类型: 1,
      //           特权开启时间: "2021-02-01 00:00:00",
      //           特权结束时间: "2026-03-21 23:59:59",
      //           进度最大值: 30,
      //           特权任务: 58000043,
      //           回流用户类型: "12"
      //         }
      //       ]
      //     }
      //   ],
      //   method: "insert",
      //   server: 30
      // };
      axios.get("http://10.32.96.61:3457/qsm/reloading").then(res => {
        console.log(res);
        try {
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.loading = false;
        } catch (error) {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.history-record {
  height: 100vh;
}
.asyncDoc {
  width: 100%;
  border: 1px solid #ddd;
  padding: 20px 12px 150px 12px;
  border-radius: 4px;
  background: #fefefe;
  //   margin: 0 20px 0 0px;
}
</style>
