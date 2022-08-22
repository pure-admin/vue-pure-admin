import type { RouteConfigsTable } from "/#/index";
const IFrame = () => import("/@/layout/frameView.vue");

const pptRouter: RouteConfigsTable = {
  path: "/ppt",
  redirect: "/ppt/index",
  meta: {
    icon: "ppt",
    title: "PPT",
    rank: 3
  },
  children: [
    {
      path: "/ppt/index",
      name: "FramePpt",
      component: IFrame,
      meta: {
        title: "PPT",
        frameSrc: "https://pipipi-pikachu.github.io/PPTist/",
        frameLoading: false,
        extraIcon: {
          svg: true,
          name: "team-iconxinpin"
        }
      }
    }
  ]
};

export default pptRouter;
