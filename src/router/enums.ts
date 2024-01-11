// 完整版菜单比较多，将 rank 抽离出来，在此方便维护

const home = 0, // 平台规定只有 home 路由的 rank 才能为 0 ，所以后端在返回 rank 的时候需要从 1 开始哦
  able = 1,
  components = 2,
  table = 3,
  frame = 4,
  nested = 5,
  result = 6,
  error = 7,
  list = 8,
  permission = 9,
  system = 10,
  tabs = 11,
  formdesign = 12,
  flowchart = 13,
  ppt = 14,
  editor = 15,
  guide = 16,
  about = 17,
  menuoverflow = 18;

export {
  home,
  able,
  components,
  table,
  frame,
  nested,
  result,
  error,
  list,
  permission,
  system,
  tabs,
  formdesign,
  flowchart,
  ppt,
  editor,
  guide,
  about,
  menuoverflow
};
