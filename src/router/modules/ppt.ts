const Layout = () => import("/@/layout/index.vue");
const IFrame = () => import("/@/layout/frameView.vue");

const pptRouter = {
  path: "/ppt",
  component: Layout,
  redirect: "/ppt/index",
  meta: {
    icon: "ppt",
    title: "PPT",
    i18n: false,
    rank: 3
  },
  children: [
    {
      path: "/ppt/index",
      name: "reFrameppt",
      component: IFrame,
      meta: {
        title: "PPT",
        i18n: false,
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
