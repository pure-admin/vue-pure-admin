<template>
  <div class="main">
    <el-card shadow="never">
      <template #header>
        <div class="flex justify-between items-center">
          <span>竞赛管理</span>
          <el-button
            type="primary"
            :icon="useRenderIcon('addFill')"
            @click="handleOpenDialog()"
          >
            新增竞赛
          </el-button>
        </div>
      </template>

      <pure-table
        row-key="id"
        adaptive
        align-whole="center"
        table-layout="auto"
        :data="dataList"
        :columns="columns"
        :loading="loading"
      >
        <template #operation="{ row }">
          <el-button link type="primary" @click="handleOpenDialog(row)"
            >修改</el-button
          >
          <el-popconfirm title="是否确认删除?" @confirm="handleDelete(row)">
            <template #reference>
              <el-button link type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </pure-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="form.id ? '编辑竞赛' : '新增竞赛'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="年份">
          <el-input-number v-model="form.year" :min="2000" :max="2100" />
        </el-form-item>
        <el-form-item label="级别">
          <el-select
            v-model="form.level"
            placeholder="请选择级别"
            class="w-full"
          >
            <el-option
              v-for="item in levelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类别">
          <el-select
            v-model="form.category"
            placeholder="请选择类别"
            class="w-full"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="form.uri" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { message } from "@/utils/message";
import {
  getCompList,
  createComp,
  updateComp,
  deleteComp,
  getCompLevels,
  getCompCategories,
  CompInfo
} from "@/api/comp";

// 表格列配置
const columns: TableColumnList = [
  { label: "ID", prop: "id", width: 70 },
  { label: "竞赛标题", prop: "title" },
  { label: "年份", prop: "year", width: 100 },
  { label: "级别", prop: "level_name", width: 100 },
  { label: "类别", prop: "category_name", width: 120 },
  { label: "链接", prop: "uri" },
  { label: "操作", fixed: "right", width: 150, slot: "operation" }
];

const loading = ref(true);
const dataList = ref([]);
const dialogVisible = ref(false);
const levelOptions = ref([]);
const categoryOptions = ref([]);

const initialForm: CompInfo = {
  title: "",
  description: "",
  year: new Date().getFullYear(),
  category: null,
  uri: "",
  level: null
};
const form = reactive({ ...initialForm });

/** 刷新列表 */
async function onSearch() {
  loading.value = true;
  try {
    // 关键点：直接接收返回结果，后端返回的是 [{}, {}]
    const res = await getCompList();
    // 如果 res 本身就是数组，直接赋值；
    // 如果 Pure Admin 的拦截器把数组包在了 res.data 里，则取 res.data
    dataList.value = Array.isArray(res) ? res : (res as any).data;
    console.log("列表解析成功:", dataList.value);
  } catch (e) {
    console.error("解析失败", e);
  } finally {
    loading.value = false;
  }
}
/** 打开弹窗（新增/编辑） */
function handleOpenDialog(row?: CompInfo) {
  Object.assign(form, row || initialForm);
  if (!row) delete form.id;
  dialogVisible.value = true;
}

/** 提交表单 */
async function handleSubmit() {
  if (form.id) {
    await updateComp(form.id, form);
    message("更新成功", { type: "success" });
  } else {
    await createComp(form);
    message("创建成功", { type: "success" });
  }
  dialogVisible.value = false;
  onSearch();
}

/** 删除 */
async function handleDelete(row: CompInfo) {
  await deleteComp(row.id);
  message("删除成功", { type: "success" });
  onSearch();
}

/** 初始化数据 */
onMounted(async () => {
  onSearch();
  try {
    // 处理竞赛级别下拉框
    const levelsRes = await getCompLevels();
    levelOptions.value = Array.isArray(levelsRes)
      ? levelsRes
      : (levelsRes as any).data;

    // 处理竞赛类别下拉框
    const catsRes = await getCompCategories();
    categoryOptions.value = Array.isArray(catsRes)
      ? catsRes
      : (catsRes as any).data;
    // 注意：确保后端返回的数组项中包含 'id' 和 'name' 字段
    // 如果后端返回的是 {"id": 1, "category_name": "创新创业"}
    // 那么下方的 el-option label 应该对应修改为 item.category_name
  } catch (e) {
    console.error("加载配置项失败", e);
  }
});
</script>
