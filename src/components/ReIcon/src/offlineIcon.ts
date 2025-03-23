// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { getIcons } from "@iconify/utils";
import { addCollection } from "@iconify/vue/dist/offline";

// 本地菜单图标，后端在路由的 icon 中返回对应的图标字符串并且前端在此处使用 addCollection 添加即可渲染菜单图标
import { icons as iconsEp } from "@iconify-json/ep";
addCollection(
  getIcons(iconsEp, [
    "menu",
    "edit",
    "guide",
    "set-up",
    "monitor",
    "lollipop",
    "histogram",
    "home-filled"
  ])
);

import { icons as iconsRi } from "@iconify-json/ri";
addCollection(
  getIcons(iconsRi, [
    "mind-map",
    "admin-fill",
    "table-line",
    "links-fill",
    "admin-line",
    "list-check",
    "ubuntu-fill",
    "search-line",
    "window-line",
    "history-fill",
    "edit-box-line",
    "artboard-line",
    "code-box-line",
    "markdown-line",
    "bank-card-line",
    "file-info-line",
    "bookmark-2-line",
    "file-ppt-2-line",
    "git-branch-line",
    "settings-3-line",
    "user-voice-line",
    "file-search-line",
    "information-line",
    "chat-search-line",
    "terminal-window-line",
    "checkbox-circle-line",
    "bar-chart-horizontal-line"
  ])
);
