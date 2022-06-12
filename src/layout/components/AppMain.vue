<template>
  <section class="app-main">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <flow-tree @jumpClick="jumpTree"></flow-tree>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import FlowTree from "@/components/Flow-tree";
export default {
  name: "AppMain",
  components: { Hamburger, FlowTree },
  computed: {
    ...mapGetters(["sidebar"]),
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
      // return this.$router.push({
      //   query: {
      //     t: Date.now()
      //   }
      // });
    },
  },
  methods: {
    toggleSideBar() {
      console.log("-----");
      this.$store.dispatch("app/toggleSideBar");
    },
    jumpTree() {
      console.log("@@@@@@@");
      // this.$router.push("/HistoryRecord");
      this.$router.push("/CustomModel");
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  // width: 100%;
  position: relative;
  top: 112px;
  overflow: hidden;
  overflow-x: hidden !important;
  margin-left: 220px;
  .hamburger-container {
    width: 46px;
    line-height: 46px;
    border-radius: 50%;
    text-align: center;
    height: 100%;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
