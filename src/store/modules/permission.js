import { asyncRoutes, constantRoutes } from '@/router'
import Layout from "@/layout";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export function filterAsyncRouters(routers) {
  // 遍历后台传来的路由字符串，转换为组件对象
  let accessedRouters = routers.filter((router) => {
    if (router.meta) {
      // 默认图标处理
      router.meta.icon = router.meta.icon ? router.meta.icon : "edit";
    }
    if (router.component === "Layout") {
      // Main组件特殊处理
      router.component = Layout;
    } else {
      //处理组件---重点
      router.component = loadView(router.component);
    }
    //存在子集
    if (router.children && router.children.length) {
      router.children = filterAsyncRouters(router.children);
    }
    return true;
  });
  return accessedRouters;
}
export function loadView(view) {
  // return Layout;
  // item.component 不等于 'Layout',则说明它是组件路径地址，因此直接替换成路由引入的方法
  return resolve => require([`@/views/${view}`],resolve)
  // 此处用reqiure比较好，import引入变量会有各种莫名的错误
  // return (() => import(`@/views/${view}`));
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = filterAsyncRouters(asyncRoutes()) || []
      } else {
        accessedRoutes = filterAsyncRouters(asyncRoutes())
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
