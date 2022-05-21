const Layout = () => import("/@/layout/index.vue");
const IFrame = () => import("/@/layout/frameView.vue");

const pptRouter = {
  path: "/ppt",
  component: Layout,
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
        extraIcon: {
          svg: true,
          name: "team-iconxinpin"
        }
      }
    }
  ]
};

export default pptRouter;
