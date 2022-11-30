import { ppt } from "@/router/enums";
const IFrame = () => import("@/layout/frameView.vue");
import Ppt from "@iconify-icons/ri/file-ppt-2-line";

export default {
  path: "/ppt",
  redirect: "/ppt/index",
  meta: {
    icon: Ppt,
    title: "PPT",
    rank: ppt
  },
  children: [
    {
      path: "/ppt/index",
      name: "FramePpt",
      component: IFrame,
      meta: {
        title: "PPT",
        frameSrc: "https://pipipi-pikachu.github.io/PPTist/",
        frameLoading: false
      }
    }
  ]
} as RouteConfigsTable;
