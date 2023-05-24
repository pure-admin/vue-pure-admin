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
          <a
            href="https://yiming_chang.gitee.io/pure-admin-doc"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">文档地址</span>
          </a>
        );
      }
    },
    {
      label: "预览地址",
      cellRenderer: () => {
        return (
          <a
            href="https://yiming_chang.gitee.io/vue-pure-admin"
            target="_blank"
          >
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
            href="https://github.com/pure-admin/vue-pure-admin"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">Github</span>
          </a>
        );
      }
    },
    {
      label: "精简版",
      cellRenderer: () => {
        return (
          <a
            href="https://github.com/pure-admin/pure-admin-thin"
            target="_blank"
          >
            <span style="color: var(--el-color-primary)">精简版</span>
          </a>
        );
      }
    }
  ];

  return {
    columns
  };
}
