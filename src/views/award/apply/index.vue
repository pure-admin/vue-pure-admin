<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { message } from "@/utils/message";
import type { UploadInstance, FormInstance, FormRules } from "element-plus";
import { Plus, Search } from "@element-plus/icons-vue";
import { getAwardApplies, type AwardApplyItem } from "@/api/apply";

/*
获取申请记录
*/
const activeTab = ref("form"); // 控制当前显示的标签页
const tableData = ref<AwardApplyItem[]>([]);
const tableLoading = ref(false);

// 状态字典映射
const statusMap = {
  pending: { text: "受理中", type: "warning" },
  rejected: { text: "已拒绝", type: "danger" },
  approved: { text: "已通过", type: "success" }
};

// 获取数据列表
const fetchTableData = async () => {
  tableLoading.value = true;
  try {
    const res = await getAwardApplies();
    tableData.value = res;
  } finally {
    tableLoading.value = false;
  }
};

const detailVisible = ref(false);
const currentItem = ref<AwardApplyItem | null>(null);

const viewDetail = (row: AwardApplyItem) => {
  currentItem.value = row;
  detailVisible.value = true;
};

/*
提交申请
*/

// 引入 API
import {
  createAwardApply,
  searchCompetitions,
  type AwardPayload
} from "@/api/apply";
import { getCompLevels, getCompCategories } from "@/api/comp"; // 假设路径
import { searchUserByName, type UserProfileSearchItem } from "@/api/user"; // 假设路径

// --- 数据定义 ---

const formRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();
const loading = ref(false);
const imageUrl = ref(""); // 用于存储预览图的本地 URL

// 下拉框选项数据
const levelOptions = ref<any[]>([]);
const categoryOptions = ref<any[]>([]);
const compSearchOptions = ref<any[]>([]); // 竞赛搜索结果
const participantOptions = ref<UserProfileSearchItem[]>([]); // 参赛者搜索结果
const instructorOptions = ref<UserProfileSearchItem[]>([]); // 指导老师搜索结果

// 搜索 Loading 状态
const searchLoading = ref(false);

// 表单数据模型
const formData = reactive({
  cert_no: "",
  cert_image: null as File | null,
  award_level: "", // 获奖等次文本，如“一等奖”
  award_date: "", // 获奖日期
  // Payload 相关字段平铺在这里，方便绑定，提交时再组装
  comp_id: null as number | null,
  comp_title: "",
  year: new Date().getFullYear(),
  description: "",
  uri: "",
  category_id: null as number | null,
  level_id: null as number | null,
  participant_ids: [] as string[], // 存用户ID
  instructor_ids: [] as string[] // 存用户ID
});

// 表单校验规则
const rules = reactive<FormRules>({
  cert_no: [{ required: true, message: "请输入证书编号", trigger: "blur" }],
  award_level: [{ required: true, message: "请输入获奖等次", trigger: "blur" }],
  award_date: [
    { required: true, message: "请选择获奖日期", trigger: "change" }
  ],
  comp_title: [{ required: true, message: "请输入竞赛名称", trigger: "blur" }],
  year: [{ required: true, message: "请选择年份", trigger: "change" }],
  category_id: [
    { required: true, message: "请选择竞赛类别", trigger: "change" }
  ],
  level_id: [{ required: true, message: "请选择竞赛级别", trigger: "change" }],
  participant_ids: [
    { required: true, message: "请至少选择一名参赛者", trigger: "change" }
  ]
  // cert_image 手动校验
});

// --- 方法实现 ---

// 1. 初始化加载字典数据
onMounted(async () => {
  try {
    const [levels, categories] = await Promise.all([
      getCompLevels(),
      getCompCategories()
    ]);
    // 根据实际 API 返回解构，这里假设返回的就是数组
    levelOptions.value = levels.result || levels;
    categoryOptions.value = categories.result || categories;
  } catch (e) {
    console.error("加载字典失败", e);
  }
});

// 2. 竞赛搜索逻辑
const handleCompSearch = async (query: string) => {
  if (query) {
    searchLoading.value = true;
    try {
      const res = await searchCompetitions(query);
      compSearchOptions.value = res; // 假设 res 直接是数组，如描述中的 []
    } finally {
      searchLoading.value = false;
    }
  } else {
    compSearchOptions.value = [];
  }
};

// 3. 选中现有竞赛
const handleCompSelect = (item: any) => {
  // 填充表单
  formData.comp_id = item.id;
  formData.comp_title = item.title;
  formData.year = item.year;
  formData.description = item.description || "";
  formData.uri = item.uri || "";
  formData.category_id = item.category; // 注意：API返回的是 category (int) 还是 category_id，根据描述是 category
  formData.level_id = item.level; // 同上
  message("已自动填充现有竞赛信息", { type: "success" });
};

// 4. 清除选中/切换为新建
// 监听 comp_title 的变化，如果用户修改了标题，可能意味着这是一个新竞赛
const handleTitleChange = () => {
  // 简单的逻辑：如果用户手动输入标题，我们就不再将其视为引用现有ID
  // 或者你可以提供一个显式的按钮 "重置为新竞赛"
  // 这里保留 comp_id 以防用户只是改个错别字，但在后端逻辑中，
  // 通常如果 comp_id 存在，后端会更新该 ID 的数据或报错。
  // 为了安全，如果希望由后端判断新建，可以将 comp_id 置空：
  // formData.comp_id = null;
};

// 5. 人员搜索逻辑 (通用)
const handleUserSearch = async (
  query: string,
  type: "participant" | "instructor"
) => {
  if (query) {
    searchLoading.value = true;
    try {
      const res = await searchUserByName(query);
      // API 返回结构是 { result: [...] } 还是直接 [...]? 假设 user.ts 里的 request 已经处理了 result
      const list = Array.isArray(res) ? res : (res as any)?.result || [];
      if (type === "participant") {
        participantOptions.value = list;
      } else {
        instructorOptions.value = list;
      }
    } finally {
      searchLoading.value = false;
    }
  }
};

// 6. 文件处理
const handleFileChange = (file: any) => {
  const rawFile = file.raw;

  // 1. 真正的文件类型校验 (MIME Type)
  const isImage = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ].includes(rawFile.type);
  if (!isImage) {
    message("只能上传图片格式文件 (JPG/PNG/GIF/WEBP)!", { type: "error" });
    // 从上传列表中移除该文件
    uploadRef.value?.handleRemove(file);
    return false;
  }

  // 2. 文件大小校验 (5MB = 5 * 1024 * 1024 bytes)
  const isLt5M = rawFile.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message("上传图片大小不能超过 5MB!", { type: "error" });
    uploadRef.value?.handleRemove(file);
    return false;
  }

  // 校验通过后的逻辑
  formData.cert_image = rawFile;
  imageUrl.value = URL.createObjectURL(rawFile);
  formRef.value?.clearValidate("cert_image");
};

// 移除文件函数
const handleRemoveFile = () => {
  formData.cert_image = null;
  // 释放内存并清空预览图
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
    imageUrl.value = "";
  }
};

// 7. 提交表单
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 手动校验文件
  if (!formData.cert_image) {
    message("请上传证书图片", { type: "warning" });
    return;
  }

  await formEl.validate(async valid => {
    if (valid) {
      loading.value = true;
      try {
        // 构造 Payload 对象
        const payloadObj: AwardPayload = {
          comp_id: formData.comp_id, // 如果是新竞赛，这里应该是 null (初始值)
          comp_title: formData.comp_title,
          year: formData.year,
          description: formData.description,
          uri: formData.uri,
          category_id: formData.category_id!,
          level_id: formData.level_id!,
          participant_ids: formData.participant_ids,
          instructor_ids: formData.instructor_ids
        };

        // 构造 FormData
        const submitData = new FormData();
        submitData.append("cert_no", formData.cert_no);
        submitData.append("cert_image", formData.cert_image as Blob);
        submitData.append("award_level", formData.award_level);
        submitData.append("award_date", formData.award_date);
        // 核心：将对象转为 JSON 字符串放入 payload 字段
        submitData.append("payload", JSON.stringify(payloadObj));

        await createAwardApply(submitData);
        activeTab.value = "list";
        fetchTableData();
        message("申请提交成功！", { type: "success" });
        // 重置表单
        formEl.resetFields();
        uploadRef.value?.clearFiles();
        formData.cert_image = null;
        formData.comp_id = null;
      } catch (error) {
        console.error(error);
        // message 通常在 http 拦截器里处理了，如果没有，这里加 message.error
      } finally {
        loading.value = false;
      }
    }
  });
};

// 8.监听方法
watch(
  () => formData.award_date,
  newDate => {
    if (newDate) {
      // 提取年份字符串并转为数字
      const year = new Date(newDate).getFullYear();
      formData.year = year;
    }
  }
);
</script>

<template>
  <div class="main-content p-5 bg-white m-4 rounded shadow-sm">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="填写申请" name="form">
        <h3 class="mb-6 text-xl font-bold">提交获奖申请</h3>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="120px"
          class="max-w-200"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="证书编号" prop="cert_no">
                <el-input v-model="formData.cert_no" placeholder="请输入编号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="获奖日期" prop="award_date">
                <el-date-picker
                  v-model="formData.award_date"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  class="w-full"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="获奖等次" prop="award_level">
            <el-input
              v-model="formData.award_level"
              placeholder="例如：一等奖、金奖、冠军"
            />
          </el-form-item>

          <el-form-item label="证书图片" required>
            <el-upload
              ref="uploadRef"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
              :on-change="handleFileChange"
              :on-remove="handleRemoveFile"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
            <div class="el-upload__tip text-gray-400">
              请上传 jpg/png 文件，且不超过 5MB
            </div>
          </el-form-item>

          <el-divider content-position="left">竞赛详情信息</el-divider>

          <el-form-item label="搜索现有竞赛">
            <el-select
              v-model="formData.comp_id"
              filterable
              remote
              clearable
              placeholder="输入关键词搜索现有竞赛（如：蓝桥杯）"
              :remote-method="handleCompSearch"
              :loading="searchLoading"
              @change="
                val => {
                  const item = compSearchOptions.find(i => i.id === val);
                  if (item) handleCompSelect(item);
                  else formData.comp_id = null; // 清空时重置ID
                }
              "
            >
              <el-option
                v-for="item in compSearchOptions"
                :key="item.id"
                :label="`${item.title} (${item.year})`"
                :value="item.id"
              />
            </el-select>
            <div class="ml-2 text-xs text-gray-400 self-center">
              * 若搜不到，请直接在下方填写新信息，系统将自动创建。
            </div>
          </el-form-item>

          <el-form-item label="竞赛名称" prop="comp_title">
            <el-input
              v-model="formData.comp_title"
              placeholder="请输入竞赛全称"
              @input="handleTitleChange"
            />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="获奖年份" prop="year">
                <el-date-picker
                  v-model="formData.year"
                  type="year"
                  value-format="YYYY"
                  placeholder="选择年份"
                  class="w-full"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="官网链接" prop="uri">
                <el-input v-model="formData.uri" placeholder="http://" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="竞赛类别" prop="category_id">
                <el-select
                  v-model="formData.category_id"
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
            </el-col>
            <el-col :span="12">
              <el-form-item label="获奖等级" prop="level_id">
                <el-select
                  v-model="formData.level_id"
                  placeholder="请选择等级"
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
            </el-col>
          </el-row>

          <el-form-item label="竞赛简介" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="2"
              placeholder="竞赛简介"
            />
          </el-form-item>

          <el-divider content-position="left">人员信息</el-divider>

          <el-form-item label="参赛学生" prop="participant_ids">
            <el-select
              v-model="formData.participant_ids"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="输入姓名搜索学生"
              :remote-method="q => handleUserSearch(q, 'participant')"
              :loading="searchLoading"
              class="w-full"
            >
              <el-option
                v-for="item in participantOptions"
                :key="item.user_id"
                :label="`${item.real_name} (${item.department || '未知部门'})`"
                :value="item.user_id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="指导老师" prop="instructor_ids">
            <el-select
              v-model="formData.instructor_ids"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="输入姓名搜索老师"
              :remote-method="q => handleUserSearch(q, 'instructor')"
              :loading="searchLoading"
              class="w-full"
            >
              <el-option
                v-for="item in instructorOptions"
                :key="item.user_id"
                :label="`${item.real_name} (${item.department || '未知部门'})`"
                :value="item.user_id"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              @click="onSubmit(formRef)"
            >
              提交申请
            </el-button>
            <el-button @click="formRef?.resetFields()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="申请记录" name="list">
        <div class="flex justify-between mb-4">
          <h3 class="text-lg font-bold">我的申请历史</h3>
          <el-button :icon="Search" @click="fetchTableData">刷新</el-button>
        </div>

        <el-table
          v-loading="tableLoading"
          :data="tableData"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column label="证书图片" width="120">
            <template #default="scope">
              <el-image
                class="w-20 h-20 rounded"
                :src="scope.row.cert_image"
                :preview-src-list="[scope.row.cert_image]"
                preview-teleported
                fit="cover"
              />
            </template>
          </el-table-column>

          <el-table-column
            prop="payload.comp_title"
            label="竞赛名称"
            min-width="150"
          />
          <el-table-column prop="award_level" label="获奖等次" width="100" />
          <el-table-column
            prop="award_date"
            label="获奖日期"
            width="120"
            sortable
          />
          <el-table-column label="审核状态" width="100">
            <template #default="scope">
              <el-tag :type="statusMap[scope.row.status].type">
                {{ statusMap[scope.row.status].text }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="详情" width="200">
            <template #default="scope">
              <div class="text-xs text-gray-500">
                <p>编号: {{ scope.row.cert_no }}</p>
                <p>
                  参与人ID: {{ scope.row.payload.participant_ids?.join(", ") }}
                </p>
                <p>
                  提交时间:
                  {{ new Date(scope.row.created_at).toLocaleString() }}
                </p>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="viewDetail(scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="detailVisible" title="申请详情" width="50%">
      <el-descriptions border :column="2">
        <el-descriptions-item label="竞赛名称">{{
          currentItem?.payload.comp_title
        }}</el-descriptions-item>
        <el-descriptions-item label="获奖年份">{{
          currentItem?.payload.year
        }}</el-descriptions-item>
        <el-descriptions-item label="获奖等级">{{
          currentItem?.award_level
        }}</el-descriptions-item>
        <el-descriptions-item label="证书编号">{{
          currentItem?.cert_no
        }}</el-descriptions-item>
        <el-descriptions-item label="竞赛描述" :span="2">{{
          currentItem?.payload.description
        }}</el-descriptions-item>
        <el-descriptions-item label="指导老师">{{
          currentItem?.payload.instructor_ids?.join(", ")
        }}</el-descriptions-item>
        <el-descriptions-item label="证书原件" :span="2">
          <el-image :src="currentItem?.cert_image" class="max-w-75" />
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 简单的样式微调，PureAdmin 已内置 TailwindCSS，很多样式可直接写 class */
</style>
