import { $t } from "/@/plugins/i18n";
const Layout = () => import("/@/layout/index.vue");

const externalLink = {
  path: "/external",
  name: "external",
  component: Layout,
  meta: {
    icon: "link",
    title: $t("menus.externalLink"),
    i18n: true,
    rank: 190
  },
  children: [
    {
      path: "https://github.com/xiaoxian521/vue-pure-admin",
      meta: {
        title: $t("menus.externalLink"),
        i18n: true,
        rank: 191
      }
    }
  ]
};

export default externalLink;
