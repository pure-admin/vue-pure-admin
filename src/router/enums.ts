// 完整版菜单比较多，将 rank 抽离出来，在此方便维护

// 平台规定只有 home 路由的 rank 才能为 0 ，所以后端在返回 rank 的时候需要从非 0 开始
const menuOrder = [
  "home", // home 必须为 0
  "study",
  "chatai",
  "vueflow",
  "ganttastic",
  "components",
  "able",
  "table",
  "form",
  "list",
  "result",
  "error",
  "frame",
  "nested",
  "permission",
  "system",
  "monitor",
  "tabs",
  "about",
  "codemirror",
  "markdown",
  "editor",
  "flowchart",
  "formdesign",
  "board",
  "ppt",
  "mind",
  "guide",
  "menuoverflow"
] as const;

const menuRanks = Object.fromEntries(
  menuOrder.map((name, idx) => [name, idx])
) as Record<(typeof menuOrder)[number], number>;

export const {
  home,
  chatai,
  vueflow,
  ganttastic,
  components,
  able,
  table,
  form,
  list,
  result,
  error,
  frame,
  nested,
  permission,
  system,
  monitor,
  tabs,
  about,
  codemirror,
  markdown,
  editor,
  flowchart,
  formdesign,
  board,
  ppt,
  mind,
  guide,
  menuoverflow,
  study
} = menuRanks;
