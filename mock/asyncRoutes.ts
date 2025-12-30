// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: ({ query }) => {
      const roles = query.roles as string;

      // 1. 获奖管理模块 (通用的部分)
      const awardMenu = {
        path: "/award",
        meta: { title: "获奖管理", icon: "ri:award-line" },
        children: []
      };

      // 根据角色添加子菜单
      if (["Student", "Teacher", "Administrator"].includes(roles)) {
        awardMenu.children.push({
          path: "/award/my",
          name: "AwardMy",
          component: "award/my/index",
          meta: { title: "我的获奖" }
        });
      }

      if (["CompetitionAdministrator", "Administrator"].includes(roles)) {
        awardMenu.children.push(
          {
            path: "/award/overview",
            name: "AwardOverview",
            component: "award/overview/index",
            meta: { title: "总览" }
          },
          {
            path: "/award/search",
            name: "AwardSearch",
            component: "award/search/index",
            meta: { title: "获奖查询" }
          },
          {
            path: "/award/entry",
            name: "AwardEntry",
            component: "award/entry/index",
            meta: { title: "奖项录入" }
          },
          {
            path: "/award/report",
            name: "AwardReport",
            component: "award/report/index",
            meta: { title: "报表打印" }
          }
        );
      }

      // 2. 角色特有模块
      const routes = [awardMenu];

      if (["CompetitionAdministrator", "Administrator"].includes(roles)) {
        routes.push({
          path: "/competition",
          meta: { title: "竞赛管理", icon: "ri: trophy-line" },
          children: [
            {
              path: "/competition/overview",
              component: "competition/overview/index",
              meta: { title: "总览" }
            },
            {
              path: "/competition/search",
              component: "competition/search/index",
              meta: { title: "查询竞赛" }
            },
            {
              path: "/competition/entry",
              component: "competition/entry/index",
              meta: { title: "竞赛录入" }
            }
          ]
        } as any);
      }

      if (roles === "Administrator") {
        routes.push({
          path: "/user",
          meta: { title: "用户管理", icon: "ri:admin-line" },
          children: [
            {
              path: "/user/overview",
              component: "user/overview/index",
              meta: { title: "总览" }
            },
            {
              path: "/user/create",
              component: "user/create/index",
              meta: { title: "创建用户" }
            },
            {
              path: "/user/search",
              component: "user/search/index",
              meta: { title: "查询用户" }
            }
          ]
        } as any);
      }

      return {
        success: true,
        data: routes
      };
    }
  }
]);
