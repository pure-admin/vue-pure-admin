import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

import Layout from '../layout/index.vue'

import { storageSession } from "../utils/storage"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Layout,
    redirect: "/home/welcome",
    meta: {
      savedPosition: false,
      showLink: false
    }
  },
  {
    path: '/user',
    name: 'user',
    component: Layout,
    children: [
      {
        path: '/user/base',
        component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
        meta: {
          // icon: 'el-icon-user',
          title: 'baseinfo',
          showLink: false,
          savedPosition: true
        }
      },
    ],
    meta: {
      icon: 'el-icon-user',
      title: 'usermanagement',
      showLink: true,
      savedPosition: true
    }
  },
  {
    path: '/error',
    name: 'error',
    component: Layout,
    children: [
      {
        path: '/error/401',
        component: () => import(/* webpackChunkName: "error" */ '../views/error/401.vue'),
        meta: {
          title: '401',
          showLink: false,
          savedPosition: true
        }
      },
      {
        path: '/error/404',
        component: () => import(/* webpackChunkName: "error" */ '../views/error/404.vue'),
        meta: {
          title: '404',
          showLink: false,
          savedPosition: true
        }
      },
    ],
    meta: {
      icon: 'el-icon-position',
      title: 'error',
      showLink: true,
      savedPosition: true
    }
  },
  {
    path: '/components',
    name: 'components',
    component: Layout,
    children: [
      {
        path: '/components/split-pane',
        component: () => import(/* webpackChunkName: "components" */ '../views/components/split-pane/index.vue'),
        meta: {
          title: 'split-pane',
          showLink: false,
          savedPosition: true
        }
      }
    ],
    meta: {
      icon: 'el-icon-menu',
      title: 'components',
      showLink: true,
      savedPosition: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    meta: {
      title: '登陆',
      showLink: false
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/register.vue'),
    meta: {
      title: '注册',
      showLink: false
    }
  },
  {
    // 找不到路由重定向到主页
    path: '/:pathMatch(.*)',
    component: Layout,
    redirect: "/error/404",
    meta: {
      icon: 'el-icon-s-home',
      title: '首页',
      showLink: false,
      savedPosition: false,
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      if (savedPosition) {
        return savedPosition
      } else {
        if (from.meta.saveSrollTop) {
          const top: number = document.documentElement.scrollTop || document.body.scrollTop
          resolve({ left: 0, top })
        }
      }
    })
  }
})

import NProgress from "../utils/progress"

const whiteList = ["/login", "/register"]

router.beforeEach((to, _from, next) => {
  NProgress.start()
  document.title = to.meta.title // 动态title
  whiteList.indexOf(to.path) !== -1 || storageSession.getItem("info") ? next() : next("/login") // 全部重定向到登录页
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router
