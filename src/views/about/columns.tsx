export function useColumns() {
  const { pkg, lastBuildTime } = __APP_INFO__;
  const { version } = pkg;
  const columns = [
    {
      label: "版本",
      cellRenderer: () => {
        return <el-tag size="small">{version}</el-tag>;
      }
    },
    {
      label: "最后编译时间",
      cellRenderer: () => {
        return <el-tag size="small">{lastBuildTime}</el-tag>;
      }
    },
    {
      label: "文档地址",
      cellRenderer: () => {
        return (
          <a href="https://pure-admin-doc.vercel.app" target="_blank">
            <span style="color: var(--el-color-primary)">文档地址</span>
          </a>
        );
      }
    },
    {
      label: "预览地址",
      cellRenderer: () => {
        return (
          <a href="https://vue-pure-admin.vercel.app" target="_blank">
            <span style="color: var(--el-color-primary)">预览地址</span>
          </a>
        );
      }
    },
    {
      label: "Github",
      cellRenderer: () => {
        return (
          <a
            href="https://github.com/xiaoxian521/vue-pure-admin"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">Github</span>
          </a>
        );
      }
    },
    {
      label: "QQ交流群",
      cellRenderer: () => {
        return (
          <a href="https://jq.qq.com/?_wv=1027&k=HntMx0dt" target="_blank">
            <span style="color: var(--el-color-primary)">
              点击链接加入群聊【Pure Admin】
            </span>
          </a>
        );
      }
    }
  ];

  return {
    columns
  };
}
