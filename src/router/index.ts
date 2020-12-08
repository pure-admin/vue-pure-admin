import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

import Home from "../views/home.vue"
import { storageSession } from "../utils/storage"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      savedPosition: false,
      showLink: false
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
    path: '/user',
    name: 'user',
    component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
    redirect: "/user/base",
    children: [
      {
        path: '/user/base',
        component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
        meta: {
          // icon: 'el-icon-user',
          title: '基础管理',
          showLink: false,
          savedPosition: true
        }
      }
    ],
    meta: {
      icon: 'el-icon-user',
      title: '用户管理',
      showLink: true,
      savedPosition: true
    }
  },
  {
    // 找不到路由重定向到主页
    path: '/:pathMatch(.*)',
    component: Home,
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

const whiteList = ["/login", "/register"]

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title // 动态title
  whiteList.indexOf(to.path) !== -1 || storageSession.getItem("accessToken") ? next() : next("/login") // 全部重定向到登录页
})

export default router
