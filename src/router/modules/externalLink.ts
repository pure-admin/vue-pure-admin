import Layout from "/@/layout/index.vue";

const externalLink = {
  path: "/external",
  name: "external",
  component: Layout,
  meta: {
    icon: "el-icon-link",
    title: "message.externalLink",
    showLink: true,
    savedPosition: true,
    rank: 190
  },
  children: [
    {
      path: "https://github.com/xiaoxian521/vue-pure-admin",
      meta: {
        icon: "el-icon-link",
        title: "message.externalLink",
        showLink: true,
        savedPosition: true,
        rank: 191
      }
    }
  ]
};

export default externalLink;
