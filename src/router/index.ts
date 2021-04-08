import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from "vue-router"

import Layout from '../layout/index.vue'

import { storageSession } from "../utils/storage"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Layout,
    redirect: "/welcome",
    children: [{
      path: '/welcome',
      name: 'welcome',
      component: () => import(/* webpackChunkName: "home" */ '../views/welcome.vue'),
      meta: {
        title: 'home',
        showLink: true,
        savedPosition: false
      }
    }],
    meta: {
      icon: 'el-icon-s-home',
      showLink: true,
      savedPosition: false,
    }
  },
  {
    path: '/components',
    name: 'components',
    component: Layout,
    redirect: '/components/split-pane',
    children: [
      {
        path: '/components/video',
        component: () => import(/* webpackChunkName: "components" */ '../views/components/video/index.vue'),
        meta: {
          title: 'video',
          showLink: false,
          savedPosition: true
        }
      },
      {
        path: '/components/map',
        component: () => import(/* webpackChunkName: "components" */ '../views/components/map/index.vue'),
        meta: {
          title: 'map',
          showLink: false,
          savedPosition: true
        }
      },
      {
        path: '/components/draggable',
        component: () => import(/* webpackChunkName: "components" */ '../views/components/draggable/index.vue'),
        meta: {
          title: 'draggable',
          showLink: false,
          savedPosition: true
        }
      },
      {
        path: '/components/split-pane',
        component: () => import(/* webpackChunkName: "components" */ '../views/components/split-pane/index.vue'),
        meta: {
          title: 'split-pane',
          showLink: false,
          savedPosition: true
        }
      },
      {
        path: '/components/button',
        component: () => import(/* webpackChunkName: "components" */ '../views/components/button/index.vue'),
        meta: {
          title: 'button',
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
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/base',
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
    path: '/editor',
    name: 'editor',
    component: Layout,
    redirect: '/editor/index',
    children: [
      {
        path: '/editor/index',
        component: () => import(/* webpackChunkName: "user" */ '../views/editor/index.vue'),
        meta: {
          // icon: 'el-icon-edit-outline',
          title: 'editor',
          showLink: false,
          savedPosition: true
        }
      },
    ],
    meta: {
      icon: 'el-icon-edit-outline',
      title: 'editor',
      showLink: true,
      savedPosition: true
    }
  },
  {
    path: '/error',
    name: 'error',
    component: Layout,
    redirect: '/error/401',
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
    // 找不到路由重定向到404页面
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
  history: createWebHashHistory(),
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
  // @ts-ignore
  document.title = to.meta.title // 动态title
  whiteList.indexOf(to.path) !== -1 || storageSession.getItem("info") ? next() : next("/login") // 全部重定向到登录页
})

router.afterEach(() => {
  NProgress.done()
})

export default router
