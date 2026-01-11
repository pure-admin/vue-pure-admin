<template>
  <div class="batch-import-container">
    <div
      class="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:bg-white transition-colors"
    >
      <el-upload
        class="upload-demo w-full text-center"
        drag
        action="#"
        :auto-upload="false"
        :on-change="handleFileSelect"
        :show-file-list="false"
        accept=".xlsx, .xls"
      >
        <el-icon class="el-icon--upload text-4xl text-gray-400"
          ><upload-filled
        /></el-icon>
        <div class="el-upload__text mt-2 text-gray-600">
          将 Excel 拖到此处，或 <em class="text-primary font-bold">点击上传</em>
        </div>
      </el-upload>
      <div v-if="uploading" class="mt-4 text-primary flex items-center gap-2">
        <el-icon class="is-loading"><Loading /></el-icon> 正在解析文件...
      </div>
    </div>

    <div class="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
      <div class="flex justify-between items-center mb-2">
        <h4 class="font-bold">批量导入指南</h4>
        <el-link type="primary" :underline="false" @click="downloadTemplate"
          >下载模板.xlsx</el-link
        >
      </div>
      <ul class="list-disc ml-4 space-y-1 text-xs text-gray-500">
        <li>支持格式：.xlsx / .xls</li>
        <li>人员格式：建议使用“姓名+学号”以精准匹配</li>
        <li>若出现重名，上传后可在弹窗中手动选择</li>
      </ul>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="数据清洗与确认"
      fullscreen
      destroy-on-close
      :close-on-click-modal="false"
    >
      <div class="h-full flex flex-col">
        <el-alert
          :title="`共解析 ${tableData.length} 条数据。请修正标红的条目，确认无误后点击提交入库。`"
          type="info"
          show-icon
          class="mb-4"
        />

        <el-table
          v-loading="tableLoading"
          :data="tableData"
          border
          stripe
          height="100%"
          row-key="id"
        >
          <el-table-column label="状态" width="80" align="center" fixed="left">
            <template #default="{ row }">
              <el-icon v-if="row.is_valid" color="#67C23A" size="20"
                ><CircleCheckFilled
              /></el-icon>
              <el-popover
                v-else
                placement="right"
                title="错误详情"
                :width="200"
                trigger="hover"
                :content="row.error_msg"
              >
                <template #reference>
                  <el-icon color="#F56C6C" size="20" class="cursor-pointer"
                    ><WarningFilled
                  /></el-icon>
                </template>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            prop="raw_competition"
            label="竞赛名称"
            min-width="180"
          >
            <template #default="{ row }">
              <div v-if="row.competition_analysis.status === 'success'">
                {{ row.competition_analysis.name }}
              </div>
              <el-select
                v-else-if="row.competition_analysis.status === 'multiple'"
                v-model="row.competition_analysis.selected_id"
                placeholder="请选择竞赛"
                size="small"
                @change="handleUpdateRow(row, 'competition')"
              >
                <el-option
                  v-for="opt in row.competition_analysis.options"
                  :key="opt.id"
                  :label="opt.name"
                  :value="opt.id"
                />
              </el-select>
              <span v-else class="text-red-500 text-xs"
                >未找到: {{ row.raw_competition }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="获奖信息" width="200">
            <template #default="{ row }">
              <div>{{ row.award_level }}</div>
              <div class="text-xs text-gray-400">{{ row.award_date }}</div>
            </template>
          </el-table-column>

          <el-table-column label="参赛学生 (点击名字可修正)" min-width="300">
            <template #default="{ row }">
              <div class="flex flex-wrap gap-2">
                <template
                  v-for="(p, idx) in row.participants_analysis"
                  :key="idx"
                >
                  <el-tag
                    v-if="p.status === 'success'"
                    type="success"
                    effect="plain"
                  >
                    {{ p.real_name }}
                  </el-tag>

                  <el-select
                    v-else-if="p.status === 'multiple'"
                    v-model="p.selected_id"
                    placeholder="请选择"
                    size="small"
                    class="w-40"
                    @change="handleUpdateRow(row, 'participants')"
                  >
                    <el-option
                      v-for="opt in p.options"
                      :key="opt.id"
                      :label="opt.label"
                      :value="opt.id"
                    />
                  </el-select>

                  <el-tooltip
                    v-else
                    content="未找到该学生，请检查名字或补全学号"
                    placement="top"
                  >
                    <el-tag type="danger">{{ p.origin_text }}</el-tag>
                  </el-tooltip>
                </template>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="指导老师" min-width="250">
            <template #default="{ row }">
              <div class="flex flex-wrap gap-2">
                <template
                  v-for="(t, idx) in row.instructors_analysis"
                  :key="idx"
                >
                  <el-tag
                    v-if="t.status === 'success'"
                    type="warning"
                    effect="plain"
                    >{{ t.real_name }}</el-tag
                  >
                  <el-select
                    v-else-if="t.status === 'multiple'"
                    v-model="t.selected_id"
                    size="small"
                    class="w-32"
                    @change="handleUpdateRow(row, 'instructors')"
                  >
                    <el-option
                      v-for="opt in t.options"
                      :key="opt.id"
                      :label="opt.label"
                      :value="opt.id"
                    />
                  </el-select>
                  <el-tag v-else type="danger">{{ t.origin_text }}</el-tag>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="dialogVisible = false">取消放弃</el-button>
          <el-button
            type="primary"
            :disabled="!canCommit"
            :loading="committing"
            @click="handleCommit"
          >
            确认并入库 ({{ validCount }} 条)
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  UploadFilled,
  Loading,
  WarningFilled,
  CircleCheckFilled
} from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import {
  uploadImportFile,
  getImportItems,
  updateImportItem,
  commitImportTask
} from "@/api/award";
import type { UploadFile } from "element-plus";

const emit = defineEmits(["success"]);

// 状态管理
const uploading = ref(false);
const dialogVisible = ref(false);
const tableLoading = ref(false);
const committing = ref(false);
const currentTaskId = ref<number | null>(null);
const tableData = ref<any[]>([]);

// 计算属性
const validCount = computed(
  () => tableData.value.filter(row => row.is_valid).length
);
// 只有当至少有一条有效数据时，才允许提交
const canCommit = computed(() => validCount.value > 0);

// 1. 文件上传处理
const handleFileSelect = async (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return;
  uploading.value = true;
  try {
    const res = await uploadImportFile(uploadFile.raw);
    currentTaskId.value = res.task_id;
    message("文件解析成功，请确认数据", { type: "success" });
    // 打开弹窗并加载暂存数据
    dialogVisible.value = true;
    fetchTableData();
  } catch (error) {
    message("解析失败，请检查文件格式", { type: "error" });
  } finally {
    uploading.value = false;
  }
};

// 2. 获取表格数据
const fetchTableData = async () => {
  if (!currentTaskId.value) return;
  tableLoading.value = true;
  try {
    const res = await getImportItems(currentTaskId.value);
    tableData.value = res; // 后端返回的 JSON 数组
  } finally {
    tableLoading.value = false;
  }
};

// 3. 行更新逻辑 (自动保存)
const handleUpdateRow = async (
  row: any,
  type: "competition" | "participants" | "instructors"
) => {
  if (!currentTaskId.value) return;
  // 构造 Payload
  const payload: any = {};
  if (type === "competition") {
    payload.competition_id = row.competition_analysis.selected_id;
  } else if (type === "participants") {
    payload.participants = row.participants_analysis;
  } else if (type === "instructors") {
    payload.instructors = row.instructors_analysis;
  }

  try {
    const res = await updateImportItem(currentTaskId.value, row.id, payload);
    // 后端返回更新后的状态 (is_valid, error_msg)，更新本地数据
    row.is_valid = res.is_valid;
    row.error_msg = res.error_msg || "";
  } catch (error) {
    message("更新失败", { type: "error" });
  }
};

// 4. 最终提交
const handleCommit = async () => {
  if (!currentTaskId.value) return;
  committing.value = true;
  try {
    const res = await commitImportTask(currentTaskId.value);
    message(res.message, { type: "success" });
    dialogVisible.value = false;
    emit("success"); // 通知父组件刷新列表
  } catch (error) {
    console.error(error);
  } finally {
    committing.value = false;
  }
};

const downloadTemplate = () => {
  window.open("/award_template.xlsx"); // 假设你的模板路径
};
</script>
