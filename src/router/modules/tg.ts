import { tg } from "@/router/enums";

export default {
  path: "/tg",
  redirect: "/tg/accounts",
  meta: {
    icon: "ri/telegram-line",
    title: "TG 炒群管理",
    rank: tg
  },
  children: [
    {
      path: "/tg/accounts",
      name: "TGAccounts",
      component: () => import("@/views/tg/accounts.vue"),
      meta: {
        title: "账号管理"
      }
    },
    {
      path: "/tg/chats",
      name: "TGChats",
      component: () => import("@/views/tg/chats.vue"),
      meta: {
        title: "群配置"
      }
    },
    {
      path: "/tg/rules",
      name: "TGRules",
      component: () => import("@/views/tg/rules.vue"),
      meta: {
        title: "关键词管理"
      }
    },
    {
      path: "/tg/monitor",
      name: "TGMonitor",
      component: () => import("@/views/tg/monitor.vue"),
      meta: {
        title: "克隆监控"
      }
    }
  ]
};
