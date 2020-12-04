import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Home from "../views/home.vue"
import { storageSession } from "../utils/storage"

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (login.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    // route level code-splitting
    // this generates a separate chunk (register.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "register" */ '../views/register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const whiteList = ["/login", "/register"]

router.beforeEach((to, _from, next) => {
  whiteList.indexOf(to.path) !== -1 || storageSession.getItem("Token") ? next() : next("/login") // 全部重定向到登录页
})

export default router
