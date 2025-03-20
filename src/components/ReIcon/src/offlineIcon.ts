// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { getIcons } from "@iconify/utils";
import { addCollection } from "@iconify/vue/dist/offline";

// 本地菜单图标，后端在路由的 icon 中返回对应的图标字符串并且前端在此处使用 addIcon 添加即可渲染菜单图标
// @iconify-json/ep
// import Menu from "~icons/ep/menu";
// import Edit from "~icons/ep/edit";
// import SetUp from "~icons/ep/set-up";
// import Guide from "~icons/ep/guide";
// import Monitor from "~icons/ep/monitor";
// import Lollipop from "~icons/ep/lollipop";
// import Histogram from "~icons/ep/histogram";
// import HomeFilled from "~icons/ep/home-filled";

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

// @iconify-json/ri
// import Tag from "~icons/ri/bookmark-2-line";
// import Ppt from "~icons/ri/file-ppt-2-line";
// import Card from "~icons/ri/bank-card-line";
// import Role from "~icons/ri/admin-fill";
// import Info from "~icons/ri/file-info-line";
// import Dept from "~icons/ri/git-branch-line";
// import Table from "~icons/ri/table-line";
// import Links from "~icons/ri/links-fill";
// import Search from "~icons/ri/search-line";
// import FlUser from "~icons/ri/admin-line";
// import Setting from "~icons/ri/settings-3-line";
// import MindMap from "~icons/ri/mind-map";
// import BarChart from "~icons/ri/bar-chart-horizontal-line";
// import LoginLog from "~icons/ri/window-line";
// import Artboard from "~icons/ri/artboard-line";
// import SystemLog from "~icons/ri/file-search-line";
// import ListCheck from "~icons/ri/list-check";
// import UbuntuFill from "~icons/ri/ubuntu-fill";
// import OnlineUser from "~icons/ri/user-voice-line";
// import EditBoxLine from "~icons/ri/edit-box-line";
// import OperationLog from "~icons/ri/history-fill";
// import InformationLine from "~icons/ri/information-line";
// import TerminalWindowLine from "~icons/ri/terminal-window-line";
// import CheckboxCircleLine from "~icons/ri/checkbox-circle-line";
// import ChatSearchLine from "~icons/ri/chat-search-line";
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

// {
//     "prefix": "ri",
//     "icons": {
//         "bookmark-2-line": {
//             "body": "<path fill=\"currentColor\" d=\"M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1m13 2H6v15.432l6-3.761l6 3.761zM8 9h8v2H8z\"/>"
//         },
//         "information-line": {
//             "body": "<path fill=\"currentColor\" d=\"M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16M11 7h2v2h-2zm0 4h2v6h-2z\"/>"
//         },
//         "search-line": {
//             "body": "<path fill=\"currentColor\" d=\"m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.98 6.98 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.98 6.98 0 0 0 4.875-1.975z\"/>"
//         }
//     },
//     "lastModified": 1734422306,
//     "width": 24,
//     "height": 24
// }
