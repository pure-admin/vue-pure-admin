<template>
  <div class="main">
    <el-card shadow="never">
      <template #header>
        <div class="flex justify-between items-center">
          <span>竞赛管理</span>
          <el-button
            type="success"
            :icon="useRenderIcon('download')"
            @click="handleExport"
          >
            导出 Excel
          </el-button>
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            accept=".xlsx, .xls"
            :on-change="handleImport"
          >
            <el-button type="warning" :icon="useRenderIcon('upload')">
              批量导入
            </el-button>
          </el-upload>
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
        <el-form-item label="规模">
          <el-select
            v-model="form.scale"
            placeholder="请选择规模"
            class="w-full"
          >
            <el-option label="校级" value="校级" />
            <el-option label="市级" value="市级" />
            <el-option label="省级" value="省级" />
            <el-option label="国家级" value="国家级" />
            <el-option label="国际级" value="国际级" />
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

    <el-dialog v-model="importVisible" title="导入预览" width="800px">
      <el-table :data="importPreviewList" border height="400">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="year" label="年份" width="80" />
        <el-table-column prop="level_name" label="级别" width="100" />
        <el-table-column prop="category_name" label="类别" width="100" />
        <el-table-column prop="scale_name" label="规模" width="100" />
        <el-table-column prop="uri" label="链接" show-overflow-tooltip />
      </el-table>
      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="importLoading"
          @click="confirmImport"
        >
          确认导入 {{ importPreviewList.length }} 条
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { read, utils, writeFile } from "xlsx";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { message } from "@/utils/message";
import {
  getCompList,
  createComp,
  updateComp,
  deleteComp,
  getCompLevels,
  getCompCategories,
  createCompLevel,
  createCompCategory,
  CompInfo
} from "@/api/comp";

// 表格列配置
const columns: TableColumnList = [
  { label: "ID", prop: "id", width: 70 },
  { label: "竞赛标题", prop: "title" },
  { label: "年份", prop: "year", width: 100 },
  { label: "规模", prop: "scale", width: 100 },
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
  level: null,
  scale: null
};
const form = reactive({ ...initialForm });

// --- 导入导出相关状态 ---
const importVisible = ref(false);
const importLoading = ref(false);
const importPreviewList = ref([]);

/** 导出功能实现 */
function handleExport() {
  if (dataList.value.length === 0) {
    message("暂无数据可导出", { type: "warning" });
    return;
  }
  // 转换数据为 Excel 格式
  const exportData = dataList.value.map(item => ({
    竞赛标题: item.title,
    年份: item.year,
    级别: item.level_name,
    类别: item.category_name,
    规模: item.scale,
    链接: item.uri,
    描述: item.description
  }));
  const worksheet = utils.json_to_sheet(exportData);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "竞赛列表");
  writeFile(workbook, `竞赛信息表_${new Date().getTime()}.xlsx`);
}

/** 导入文件处理 */
function handleImport(file: any) {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);

    importPreviewList.value = jsonData.map((item: any) => ({
      title: item["竞赛标题"],
      year: Number(item["年份"]) || new Date().getFullYear(),
      level_name: String(item["级别"] || "").trim(),
      category_name: String(item["类别"] || "").trim(),
      scale: String(item["规模"] || "").trim(),
      uri: item["链接"] || "",
      description: item["描述"] || ""
    }));
    importVisible.value = true;
  };
  reader.readAsArrayBuffer(file.raw);
}

/** 辅助函数：根据名称获取ID，不存在则创建 */
async function getOrCreateLevelId(name: string) {
  if (!name) return null;
  // 先从当前缓存中找
  let level = levelOptions.value.find(l => l.name === name);
  if (level) return level.id;

  try {
    // 不存在则调用接口创建
    const res = await createCompLevel({ name });
    const newLevel = Array.isArray(res) ? res[0] : res.data || res;
    // 更新本地下拉框缓存，避免重复创建
    levelOptions.value.push(newLevel);
    return newLevel.id;
  } catch (e) {
    console.error(`创建级别 [${name}] 失败`, e);
    return null;
  }
}

async function getOrCreateCategoryId(name: string) {
  if (!name) return null;
  let category = categoryOptions.value.find(c => c.name === name);
  if (category) return category.id;

  try {
    const res = await createCompCategory({ name });
    const newCat = Array.isArray(res) ? res[0] : res.data || res;
    categoryOptions.value.push(newCat);
    return newCat.id;
  } catch (e) {
    console.error(`创建类别 [${name}] 失败`, e);
    return null;
  }
}

/** 确认批量导入 */
async function confirmImport() {
  if (importPreviewList.value.length === 0) return;
  importLoading.value = true;
  let successCount = 0;
  let errorCount = 0;

  for (const item of importPreviewList.value) {
    try {
      // 1. 动态获取或创建级别 ID
      const levelId = await getOrCreateLevelId(item.level_name);
      // 2. 动态获取或创建类别 ID
      const categoryId = await getOrCreateCategoryId(item.category_name);

      // 3. 构造提交数据
      const submitData: CompInfo = {
        title: item.title,
        year: item.year,
        uri: item.uri,
        description: item.description,
        level: levelId,
        category: categoryId,
        scale: item.scale
      };

      await createComp(submitData);
      successCount++;
    } catch (err) {
      errorCount++;
      console.error("导入失败单条:", item.title, err);
    }
  }

  message(
    `导入完成！成功 ${successCount} 条${errorCount > 0 ? `，失败 ${errorCount} 条` : ""}`,
    {
      type: errorCount === 0 ? "success" : "warning"
    }
  );
  importLoading.value = false;
  importVisible.value = false;
  onSearch(); // 刷新列表数据
}

/** 初始化及刷新配置项的方法 */
async function loadOptions() {
  try {
    const [levelsRes, catsRes] = await Promise.all([
      getCompLevels(),
      getCompCategories()
    ]);
    levelOptions.value = Array.isArray(levelsRes)
      ? levelsRes
      : (levelsRes as any).data;
    categoryOptions.value = Array.isArray(catsRes)
      ? catsRes
      : (catsRes as any).data;
  } catch (e) {
    console.error("加载配置项失败", e);
  }
}

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
  loadOptions();
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
