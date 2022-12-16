import TypeIt from "@/components/ReTypeit";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import Tickets from "@iconify-icons/ep/tickets";
import Location from "@iconify-icons/ep/location";
import Iphone from "@iconify-icons/ep/iphone";
import Notebook from "@iconify-icons/ep/notebook";
import User from "@iconify-icons/ri/user-3-fill";

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
            <iconify-icon-offline icon={User} />
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
            <iconify-icon-offline icon={Iphone} />
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
            <iconify-icon-offline icon={Location} />
          </el-icon>
          居住地
        </div>
      ),
      value: "杭州"
    }
  ];

  const columnsB = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Tickets} />
          </el-icon>
          标签
        </div>
      ),
      cellRenderer: () => {
        return lists.map(v => {
          return (
            <el-tag class="mr-[10px]" type={v.type} size="small" effect="dark">
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
            <iconify-icon-offline icon={OfficeBuilding} />
          </el-icon>
          联系地址
        </div>
      ),
      value: "杭州市西湖区"
    }
  ];

  const columnsC = [
    {
      labelRenderer: () => (
        <div class="flex items-center">
          <el-icon>
            <iconify-icon-offline icon={Notebook} />
          </el-icon>
          好好学习，天天向上
        </div>
      ),
      cellRenderer: () => (
        <TypeIt
          className={"github"}
          values={["Coding as art. Keep open source. Enjoy open source."]}
          cursor={false}
          speed={40}
        />
      )
    }
  ];

  return {
    columnsA,
    columnsB,
    columnsC
  };
}
