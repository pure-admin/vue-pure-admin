<script setup lang="ts">
import tree from "./tree.vue";
import { useColumns } from "./columns";
import { getUserList } from "/@/api/system";
import { reactive, ref, onMounted } from "vue";
import { type FormInstance } from "element-plus";
import { TableProBar } from "/@/components/ReTable";
import { type PaginationProps } from "@pureadmin/table";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "User"
});

const form = reactive({
  username: "",
  mobile: "",
  status: ""
});
let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

const formRef = ref<FormInstance>();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

function handleUpdate(row) {
  console.log(row);
}

function handleDelete(row) {
  console.log(row);
}

function handleCurrentChange(val: number) {
  console.log(`current page: ${val}`);
}

function handleSizeChange(val: number) {
  console.log(`${val} items per page`);
}

function handleSelectionChange(val) {
  console.log("handleSelectionChange", val);
}

async function onSearch() {
  loading.value = true;
  let { data } = await getUserList();
  dataList.value = data.list;
  pagination.total = data.total;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="main flex">
    <tree />
    <div class="flex-1 ml-4">
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="bg-white w-99/100 pl-8 pt-4"
      >
        <el-form-item label="用户名称：" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobile">
          <el-input
            v-model="form.mobile"
            placeholder="请输入手机号码"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="form.status" placeholder="请选择" clearable>
            <el-option label="已开启" value="1" />
            <el-option label="已关闭" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('search')"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button
            :icon="useRenderIcon('refresh')"
            @click="resetForm(formRef)"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <TableProBar
        title="用户管理"
        :loading="loading"
        :dataList="dataList"
        @refresh="onSearch"
      >
        <template #buttons>
          <el-button type="primary" :icon="useRenderIcon('add')">
            新增用户
          </el-button>
        </template>
        <template v-slot="{ size, checkList }">
          <PureTable
            border
            align="center"
            table-layout="auto"
            :size="size"
            :data="dataList"
            :columns="columns"
            :checkList="checkList"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="{ background: '#fafafa', color: '#606266' }"
            @selection-change="handleSelectionChange"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                @click="handleUpdate(row)"
                :icon="useRenderIcon('edits')"
              >
                修改
              </el-button>
              <el-popconfirm title="是否确认删除?">
                <template #reference>
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon('delete')"
                    @click="handleDelete(row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
              <el-dropdown>
                <el-button
                  class="ml-3"
                  link
                  type="primary"
                  :size="size"
                  @click="handleUpdate(row)"
                  :icon="useRenderIcon('more')"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button
                        class="reset-margin !h-20px !text-gray-500"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon('password')"
                      >
                        重置密码
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        class="reset-margin !h-20px !text-gray-500"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon('role')"
                      >
                        分配角色
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </PureTable>
        </template>
      </TableProBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
