<template>
  <div class="navbar">
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <div class="right-menu">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" /> -->
          <img src="../../assets/img/avatar.gif" class="user-avatar" />
          <span @click="logout">退出</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Breadcrumb from "@/components/Breadcrumb";
import { mapGetters } from "vuex";
import { setToken } from "@/utils/auth";
export default {
  components: {},
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    logout() {
      // await this.$store.dispatch("user/logout");
      setToken("");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 70px;
  overflow: hidden;
  position: fixed;
  background-image: linear-gradient(45deg, #393d5a, #242739);
  box-shadow: 0 1px 4px rgba(41, 0, 5, 0.08);
  z-index: 999;

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        span {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          padding-left: 10px;
          cursor: pointer;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
