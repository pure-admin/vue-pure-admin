import dayjs from "dayjs";
import { message } from "@/utils/message";
import { getUserList } from "@/api/system";
import { ElMessageBox } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import AlertFill from "@iconify-icons/ri/alert-fill";
import { reactive, ref, computed, onMounted, VNode, Fragment } from "vue";

export function useUser() {
  const form = reactive({
    username: "",
    mobile: "",
    status: "",
    deptId: null
  });
  const dataList = ref([]);
  const loading = ref(true);
  const switchLoadMap = ref({});
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "序号",
      type: "index",
      width: 70,
      fixed: "left"
    },
    {
      label: "用户编号",
      prop: "id",
      minWidth: 130
    },
    {
      label: "用户名称",
      prop: "username",
      minWidth: 130,
      cellRenderer: ({ row, props }) => {
        if (form.username) {
          const data: string[] = row.username.split(form.username);
          const nodes: Array<VNode> = [];
          if (data.length > 1) {
            for (let index = 0; index < data.length; index++) {
              if (data[index].length > 0) {
                nodes.push(<el-text size={props.size}>{data[index]}</el-text>);
              }
              if (index < data.length - 1) {
                nodes.push(
                  <el-text size={props.size} tag="mark">
                    {form.username}
                  </el-text>
                );
              }
            }
            return <Fragment>{nodes}</Fragment>;
          } else {
            return <el-text size={props.size}>{row.username}</el-text>;
          }
        } else {
          return <el-text size={props.size}>{row.username}</el-text>;
        }
      }
    },
    {
      label: "用户昵称",
      prop: "nickname",
      minWidth: 130
    },
    {
      label: "性别",
      prop: "sex",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.sex === 1 ? "danger" : ""}
          effect="plain"
        >
          {row.sex === 1 ? "女" : "男"}
        </el-tag>
      )
    },
    {
      label: "部门",
      prop: "dept",
      minWidth: 90,
      formatter: ({ dept }) => dept.name
    },
    {
      label: "手机号码",
      prop: "mobile",
      minWidth: 90,
      headerRenderer: ({ column, props }) => {
        return (
          <el-tooltip placement="top">
            {{
              content: () => (
                <div>
                  😈假的！都是假的！
                  <br />
                  这些号码都是随机生成的毫无意义的演示数据
                </div>
              ),
              default: () => (
                <div>
                  <el-text class="font-bold" size={props.size}>
                    {column.label}
                  </el-text>
                  <el-icon color="red">
                    <iconify-icon-offline icon={AlertFill} />
                  </el-icon>
                </div>
              )
            }}
          </el-tooltip>
        );
      }
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已开启"
          inactive-text="已关闭"
          inline-prompt
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>用户吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message("已成功修改用户状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    console.log(row);
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getUserList(form);
    dataList.value = data.list;
    pagination.total = data.total;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
