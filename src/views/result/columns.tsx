import { IconifyIconOffline } from "/@/components/ReIcon";

export function useColumns() {
  const columns = [
    {
      cellRenderer: () => {
        return (
          <span class="flex items-center -mt-6">
            <IconifyIconOffline
              icon="close-circle-line"
              color="#F56C6C"
              width="18px"
              height="18px"
            />
            <span class="ml-1 mr-4">您的账户已被冻结</span>
            <a
              href="javascript:void(0);"
              class="flex items-center"
              style="color: var(--el-color-primary)"
            >
              立即解冻
              <IconifyIconOffline
                icon="arrow-right-s-line"
                color="var(--el-color-primary)"
                width="18px"
                height="18px"
              />
            </a>
          </span>
        );
      }
    },
    {
      cellRenderer: () => {
        return (
          <span class="flex items-center -mt-8">
            <IconifyIconOffline
              icon="close-circle-line"
              color="#F56C6C"
              width="18px"
              height="18px"
            />
            <span class="ml-1 mr-4">您的账户还不具备申请资格</span>
            <a
              href="javascript:void(0);"
              class="flex items-center"
              style="color: var(--el-color-primary)"
            >
              立即升级
              <IconifyIconOffline
                icon="arrow-right-s-line"
                color="var(--el-color-primary)"
                width="18px"
                height="18px"
              />
            </a>
          </span>
        );
      }
    }
  ];

  return {
    columns
  };
}
