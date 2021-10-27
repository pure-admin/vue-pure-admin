export const toggleTheme = (scopeName = "theme-default") => {
  let styleLink: any = document.getElementById("theme-button");
  if (styleLink) {
    // 假如存在id为theme-button 的link标签，直接修改其href
    styleLink.href = `/${scopeName}.css`;
    // 注：如果是removeCssScopeName:true移除了主题文件的权重类名，就可以不用修改className 操作
    document.documentElement.className = scopeName;
  } else {
    // 不存在的话，则新建一个
    styleLink = document.createElement("link");
    styleLink.type = "text/css";
    styleLink.rel = "stylesheet";
    styleLink.id = "theme-button";
    styleLink.href = `/${scopeName}.css`;
    // 注：如果是removeCssScopeName:true移除了主题文件的权重类名，就可以不用修改className 操作
    document.documentElement.className = scopeName;
    document.head.append(styleLink);
  }
};
