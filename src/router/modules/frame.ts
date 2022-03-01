import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const IFrame = () => import("/@/layout/frameView.vue");

const frameRouter = {
  path: "/frame",
  name: "reFrame",
  redirect: "/frame/index",
  component: Layout,
  meta: {
    icon: "Document",
    title: $t("menus.hsProjectDocument"),
    i18n: true,
    rank: 12
  },
  children: [
    {
      path: "/frame/index",
      name: "reFrame",
      meta: {
        i18n: true,
        title: $t("menus.hsProjectDocument"),
        frameSrc: "https://pure-admin-doc.vercel.app"
      },
      component: IFrame
    }
  ]
};
export default frameRouter;
