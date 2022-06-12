import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'

// import nestedRouter from './modules/nested'
var cacheRouter = null
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: ' ', affix: true }
      }
    ]
  },
  {
    path: '/HistoryRecord',
    component: () => import('@/views/HistoryRecord/HistoryRecord'),
  },
  {
    path: '/CustomModel',
    component: () => import('@/views/CustomModel/CustomModel'),
  },
]
export function setCacheRouter(router) {
  cacheRouter = router
}

export function getCacheRouter() {
  return cacheRouter
}

export function asyncRoutes() {
  let ret;
  let errorRouter = { path: '*', redirect: '/dashboard', hidden: true }
  if (cacheRouter == null) {
    ret = [ errorRouter]
  } else {
    ret = cacheRouter
    ret.push(errorRouter)
  }
  return ret
}

const createRouter = () => new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
