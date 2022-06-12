<template>
  <div class="login-container">
    <div class="dex-container">
      <div class="panel">
        <h3 class="title">运营后台管理</h3>
        <div class="other">
          <div class="account mode-block">
            <div class="sign-form">
              <div target="_self" class="link link-qrcode" @click="clientLogin">
                <div class="login-mode account-icon clearfix">
                  <span class="lt name">端游</span>
                  <span class="rt arrow-icon" />
                </div>
              </div>

              <div target="_self" class="link link-qrcode" @click="mobileLogin">
                <div class="login-mode atlas-icon account-icon clearfix">
                  <span class="lt name">手游</span>
                  <span class="rt arrow-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { clientLogin, mobileLogin } from "@/api/user";
import { setToken } from "@/utils/auth";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    async clientLogin() {
      setToken("client-token");
      try {
        const res = await clientLogin();
        localStorage.setItem("client-token", JSON.stringify(res.data.router));
        // console.log(JSON.stringify(res.data.router));
        this.$router.push({
          path: this.redirect || "/",
          query: this.otherQuery,
        });
      } catch (error) {
        this.$message({
          type: "error",
          message: "登录失败！",
        });
      }
    },
    async mobileLogin() {
      setToken("mobile-token");
      try {
        const res = await mobileLogin();
        localStorage.setItem("mobile-token", JSON.stringify(res.data.router));
        this.$router.push({
          path: this.redirect || "/",
          query: this.otherQuery,
        });
      } catch (error) {
        this.$message({
          type: "error",
          message: "登录失败！",
        });
      }
    },
    getOtherQuery(query) {
      console.log(query);
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  background-image: url("../../assets/img/bg.svg");
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;
  background-color: rgb(240, 241, 245);
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.dex-container {
  color: #333;
  width: 100%;
  max-width: 560px;
  min-width: 320px;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  text-align: center;
  .panel {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 40px 40px 10px 40px;
    cursor: pointer;
    .title {
      font-size: 18px;
      color: #4a4a4a;
      margin-top: 0;
      font-weight: normal;
    }
    .other {
      .mode-block {
        margin-bottom: 30px;
        .sign-form {
          .link {
            font-size: 14px;
            color: #252526;
            display: block;
            .login-mode {
              border: 1px solid #e6e8ed;
              height: 48px;
              line-height: 48px;
              margin-bottom: 10px;
              padding-left: 10px;
              padding-right: 10px;
              .name {
                padding-left: 30px;
              }
              .lt {
                float: left;
              }
              .arrow-icon {
                background-image: url(../../assets/img/arrow_rt.svg);
                background-repeat: no-repeat;
                background-size: 10px 10px;
                background-position: center;
                width: 10px;
                height: 100%;
              }
              .rt {
                float: right;
              }
            }
            .account-icon {
              background-image: url("../../assets/img/account-icon.svg");
              background-repeat: no-repeat;
              background-size: 20px 20px;
              background-position: 10px center;
            }
          }
        }
      }
    }
  }
}

.el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
  width: 86%;
  height: 45px;
  line-height: 45px;
  margin: 10px auto;
}
</style>
