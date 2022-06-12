/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const nestedRouter = {
  path: '/nested',
  component: Layout,
  redirect: '/nested/menu1/menu1-1',
  name: 'Nested',
  meta: {
    title: '运营管理',
    icon:'documentation',
    roles: ["client"],
  },
 
  children: [
    {
      path: 'menu1',
      component: () => import('@/views/nested/menu1/index'), // Parent router-view
      name: 'Menu1',
      meta: { title: '任务系统',icon: 'nested' },
      redirect: '/nested/menu1/menu1-1',
      alwaysShow: true,
      noCache: true,
      affix: true,
      children: [
        {
          path: 'menu1-1',
          component: () => import('@/views/nested/menu1/menu1-1'),
          name: 'Menu 1-1',
          meta: { title: '任务配置' },
        },
        {
          path: 'menu1-2',
          component: () => import('@/views/nested/menu1/menu1-2'),
          name: 'Menu1-2',
          redirect: '/nested/menu1/menu1-2/menu1-2-1',
          meta: { title: 'Menu 1-2' },
          hidden:true,
          alwaysShow: true,
          children: [
            {
              path: 'menu1-2-1',
              component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
              name: 'Menu1-2-1',
              meta: { title: 'Menu 1-2-1' }
            },
            {
              path: 'menu1-2-2',
              component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
              name: 'Menu1-2-2',
              meta: { title: 'Menu 1-2-2' }
            }
          ]
        },
        {
          path: 'menu1-3',
          component: () => import('@/views/nested/menu1/menu1-3'),
          name: 'Menu1-3',
          meta: { title: 'Pack任务包' }
        },
        {
          path: 'menu1-4',
          component: () => import('@/views/nested/menu1/menu1-3'),
          name: 'Menu1-4',
          meta: { title: '下架记录' }
        },
        {
          path: 'menu1-5',
          component: () => import('@/views/nested/menu1/menu1-3'),
          name: 'Menu1-5',
          meta: { title: '任务模板库' }
        }
      ]
    },
    {
      path: 'menu2',
      name: 'Menu2',
      component: () => import('@/views/nested/menu2/index'),
      meta: { title: '运营特性',icon: 'nested' },
      noCache: true,
      affix: true,
    }
  ]
}

export default nestedRouter
