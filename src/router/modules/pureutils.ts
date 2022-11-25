import { utils } from "@/router/enums";
import hot from "@/assets/svg/hot.svg?component";
const IFrame = () => import("@/layout/frameView.vue");

export default {
  path: "/pure-admin-utils",
  redirect: "/pure-admin-utils/index",
  meta: {
    icon: hot,
    title: "pure-admin-utils",
    rank: utils
  },
  children: [
    {
      path: "/pure-admin-utils/index",
      name: "FrameUtils",
      component: IFrame,
      meta: {
        title: "pure-admin-utils",
        frameSrc: "https://pure-admin-utils.netlify.app/"
      }
    }
  ]
} as RouteConfigsTable;
