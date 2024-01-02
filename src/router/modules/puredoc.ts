import { doc } from "@/router/enums";
import hot from "@/assets/svg/hot.svg?component";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/pure-admin-doc",
  redirect: "/pure-admin-doc/index",
  meta: {
    icon: hot,
    title: "pure-admin-doc",
    rank: doc
  },
  children: [
    {
      path: "/pure-admin-doc/index",
      name: "FrameDoc",
      component: IFrame,
      meta: {
        title: "pure-admin-doc",
        frameSrc: "https://yiming_chang.gitee.io/pure-admin-doc/"
      }
    }
  ]
} satisfies RouteConfigsTable;
