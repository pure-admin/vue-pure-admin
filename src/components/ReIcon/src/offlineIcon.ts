// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { getIcons } from "@iconify/utils";
import { addCollection } from "@iconify/vue/dist/offline";

// 本地菜单图标，后端在路由的 icon 中返回对应的图标字符串并且前端在此处使用 addCollection 添加即可渲染菜单图标
import { icons as iconsEp } from "@iconify-json/ep";
addCollection(
  getIcons(iconsEp, [
    "menu",
    "edit",
    "set-up",
    "guide",
    "monitor",
    "lollipop",
    "histogram",
    "home-filled"
  ])
);

import { icons as iconsRi } from "@iconify-json/ri";
addCollection(
  getIcons(iconsRi, [
    "bookmark-2-line",
    "file-ppt-2-line",
    "bank-card-line",
    "admin-fill",
    "file-info-line",
    "git-branch-line",
    "table-line",
    "links-fill",
    "search-line",
    "admin-line",
    "settings-3-line",
    "mind-map",
    "bar-chart-horizontal-line",
    "window-line",
    "artboard-line",
    "file-search-line",
    "list-check",
    "ubuntu-fill",
    "user-voice-line",
    "edit-box-line",
    "history-fill",
    "information-line",
    "terminal-window-line",
    "checkbox-circle-line",
    "chat-search-line",
    "code-box-line",
    "markdown-line"
  ])
);
