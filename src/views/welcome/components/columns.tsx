import { IconifyIconOffline } from "/@/components/ReIcon";

export function useColumns() {
  const lists = [
    { type: "", label: "善良" },
    { type: "success", label: "好学" },
    { type: "info", label: "幽默" },
    { type: "danger", label: "旅游" },
    { type: "warning", label: "追剧" }
  ];

  const columnsA = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="user" />
          </el-icon>
          用户名
        </div>
      ),
      value: "xiaoxian"
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="iphone" />
          </el-icon>
          手机号
        </div>
      ),
      value: "123456789"
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="location" />
          </el-icon>
          居住地
        </div>
      ),
      value: "上海"
    }
  ];

  const columnsB = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="tickets" />
          </el-icon>
          标签
        </div>
      ),
      cellRenderer: () => {
        return lists.map(v => {
          return (
            <el-tag class="mr-10px" type={v.type} size="small" effect="dark">
              {v.label}
            </el-tag>
          );
        });
      }
    },
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="office-building" />
          </el-icon>
          联系地址
        </div>
      ),
      value: "上海市徐汇区"
    }
  ];

  const columnsC = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <IconifyIconOffline icon="notebook" />
          </el-icon>
          好好学习，天天向上
        </div>
      ),
      value: "上海市徐汇区"
    }
  ];

  return {
    columnsA,
    columnsB,
    columnsC
  };
}
