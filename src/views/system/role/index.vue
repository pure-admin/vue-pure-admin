<script lang="ts">
export default {
  name: "role"
};
</script>

<script setup lang="ts">
import dayjs from "dayjs";
import { getRoleList } from "/@/api/system";
import { FormInstance } from "element-plus";
import { ElMessageBox } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import { EpTableProBar } from "/@/components/ReTable";
import { Switch, message } from "@pureadmin/components";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

const form = reactive({
  code: "",
  user: "",
  status: ""
});
let dataList = ref([]);
let pageSize = ref(10);
let totalPage = ref(0);
let loading = ref(true);
let switchLoadMap = ref({});

const formRef = ref<FormInstance>();

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

function onChange(checked, { $index, row }) {
  ElMessageBox.confirm(
    `确认要<strong>停用</strong><strong style='color:var(--el-color-primary)'>${row.name}</strong>角色吗?`,
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
      switchLoadMap.value[$index] = Object.assign(
        {},
        switchLoadMap.value[$index],
        {
          loading: true
        }
      );
      setTimeout(() => {
        switchLoadMap.value[$index] = Object.assign(
          {},
          switchLoadMap.value[$index],
          {
            loading: false
          }
        );
        message.success("已成功修改角色状态");
      }, 300);
    })
    .catch(() => {
      row.status === 0 ? (row.status = 1) : (row.status = 0);
    });
}

async function onSearch() {
  loading.value = true;
  let { data } = await getRoleList();
  dataList.value = data.list;
  totalPage.value = data.total;
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
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-white w-99/100 pl-8 pt-4"
    >
      <el-form-item label="角色编码：" prop="code">
        <el-input v-model="form.code" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="角色名称：" prop="user">
        <el-input v-model="form.user" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="form.status" placeholder="请选择" clearable>
          <el-option label="开启" value="1" />
          <el-option label="关闭" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('search')"
          :loading="loading"
          @click="onSearch"
        >
          搜索</el-button
        >
        <el-button :icon="useRenderIcon('refresh')" @click="resetForm(formRef)"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <EpTableProBar
      title="角色列表"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon('add')"
          >新增角色</el-button
        >
      </template>
      <template v-slot="{ size, checkList }">
        <el-table
          border
          table-layout="auto"
          :size="size"
          :data="dataList"
          :header-cell-style="{ background: '#fafafa', color: '#606266' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="checkList.includes('勾选列')"
            type="selection"
            align="center"
            width="55"
          />
          <el-table-column
            v-if="checkList.includes('序号列')"
            type="index"
            label="序号"
            align="center"
            width="70"
          />
          <el-table-column label="角色编号" align="center" prop="id" />
          <el-table-column label="角色编码" align="center" prop="code" />
          <el-table-column label="角色名称" align="center" prop="name" />
          <el-table-column label="角色排序" align="center" prop="sort" />
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <Switch
                :size="size === 'small' ? 'small' : 'default'"
                :loading="switchLoadMap[scope.$index]?.loading"
                v-model:checked="scope.row.status"
                :checkedValue="1"
                :unCheckedValue="0"
                checked-children="已开启"
                un-checked-children="已关闭"
                @change="checked => onChange(checked, scope)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            width="180"
            prop="createTime"
          >
            <template #default="scope">
              <span>{{
                dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="130"
            align="center"
          >
            <template #default="scope">
              <el-button type="text" @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-popconfirm title="是否确认删除?">
                <template #reference>
                  <el-button type="text" @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="flex justify-end mt-4"
          :small="size === 'small' ? true : false"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </template>
    </EpTableProBar>
  </div>
</template>
