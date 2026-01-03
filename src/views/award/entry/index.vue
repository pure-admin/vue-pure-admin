<template>
  <div class="main">
    <el-card shadow="never">
      <template #header>
        <div class="flex justify-between items-center">
          <span>获奖记录管理</span>
          <el-button
            type="primary"
            :icon="useRenderIcon('addFill')"
            @click="dialogVisible = true"
          >
            录入获奖信息
          </el-button>
        </div>
      </template>

      <pure-table
        row-key="id"
        adaptive
        :data="dataList"
        :columns="columns"
        :loading="loading"
      >
        <template #operation="{ row }">
          <el-button link type="primary" @click="handleView(row)"
            >详情</el-button
          >
          <el-button link type="danger" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </pure-table>
    </el-card>
    <el-dialog v-model="dialogVisible" title="录入获奖信息" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="对应竞赛" required>
          <el-select
            v-model="form.competition"
            placeholder="请选择竞赛"
            class="w-full"
            filterable
          >
            <el-option
              v-for="item in competitionOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="获奖学生" required>
          <el-select
            v-model="form.participants"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="输入姓名搜索学生"
            :remote-method="searchStudents"
            :loading="searchLoading"
            class="w-full"
          >
            <el-option
              v-for="item in studentOptions"
              :key="item.user_id"
              :label="`${item.real_name} (${item.department})`"
              :value="item.user_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="指导老师" required>
          <el-select
            v-model="form.instructors"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="输入姓名搜索老师"
            :remote-method="searchTeachers"
            :loading="searchLoading"
            class="w-full"
          >
            <el-option
              v-for="item in teacherOptions"
              :key="item.user_id"
              :label="`${item.real_name} (${item.role_name})`"
              :value="item.user_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="获奖等级" required>
          <el-input v-model="form.award_level" placeholder="例如：一等奖" />
        </el-form-item>

        <el-form-item label="获奖日期" required>
          <el-date-picker
            v-model="form.award_date"
            type="date"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </el-form-item>

        <el-divider content-position="left">证书附件</el-divider>

        <el-form-item label="证书编号" required>
          <el-input v-model="form.cert_no" placeholder="输入证书上的编号" />
        </el-form-item>

        <el-form-item label="上传证书" required>
          <el-upload
            action="#"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            accept="image/*"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖拽或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"
          >同步提交</el-button
        >
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="获奖详情信息" width="650px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="竞赛名称" :span="2">
          {{ currentRow.competition_name }}
        </el-descriptions-item>
        <el-descriptions-item label="获奖等级">
          <el-tag type="success">{{ currentRow.award_level }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="获奖日期">
          {{ currentRow.award_date }}
        </el-descriptions-item>

        <el-descriptions-item label="参赛学生" :span="2">
          <el-space wrap>
            <el-tag
              v-for="p in currentRow.participant_details"
              :key="p.id"
              effect="plain"
            >
              {{ p.username }}
            </el-tag>
          </el-space>
        </el-descriptions-item>

        <el-descriptions-item label="指导老师" :span="2">
          <el-space wrap>
            <el-tag
              v-for="i in currentRow.instructor_details"
              :key="i.id"
              type="warning"
              effect="plain"
            >
              {{ i.username }}
            </el-tag>
          </el-space>
        </el-descriptions-item>

        <el-descriptions-item label="证书信息" :span="2">
          <div
            v-if="currentRow.certificate_details"
            class="flex flex-col items-center"
          >
            <div class="w-full mb-2 text-gray-500 italic">
              证书编号：{{ currentRow.certificate_details.cert_no }}
            </div>
            <el-image
              style="width: 100%; max-height: 300px"
              :src="currentRow.certificate_details.image_uri"
              :preview-src-list="[currentRow.certificate_details.image_uri]"
              fit="contain"
              preview-teleported
            >
              <template #error>
                <div
                  class="flex items-center justify-center w-full h-37.5 bg-gray-100 text-gray-400"
                >
                  暂无图片
                </div>
              </template>
            </el-image>
          </div>
          <span v-else class="text-gray-400">未关联证书</span>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { debounce } from "lodash-es";
import { UploadFilled } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { getCompList } from "@/api/comp";
import { createAwardWithCert, deleteAward, getAwardList } from "@/api/award";
import { searchUserByName, UserProfileSearchItem } from "@/api/user"; // 假设在user.ts
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessageBox } from "element-plus";
import { createCert } from "@/api/certificate";

const dialogVisible = ref(false);
const searchLoading = ref(false);
const submitLoading = ref(false);

const detailVisible = ref(false); // 更多操作
const currentRow = ref<any>({});

function handleView(row: any) {
  currentRow.value = row;
  detailVisible.value = true;
}

const loading = ref(false); // 表格加载状态

const dataList = ref([]); // 获奖列表数据

// 2. 确保定义了 columns，否则 pure-table 会导致白屏
const columns: TableColumnList = [
  {
    label: "竞赛名称",
    prop: "competition_name",
    minWidth: 150
  },
  {
    label: "获奖等级",
    prop: "award_level",
    width: 100
  },
  {
    label: "获奖学生",
    formatter: ({ participant_details }) =>
      participant_details?.map(p => p.username).join(", ") || "无"
  },
  {
    label: "日期",
    prop: "award_date",
    width: 120
  },
  {
    label: "操作",
    fixed: "right",
    width: 160,
    slot: "operation"
  }
];

const competitionOptions = ref([]);
const studentOptions = ref<UserProfileSearchItem[]>([]);
const teacherOptions = ref<UserProfileSearchItem[]>([]);
const uploadFile = ref<File | null>(null);

const form = reactive({
  competition: null,
  participants: [], // ID 数组
  instructors: [], // ID 数组
  award_level: "",
  award_date: "",
  cert_no: ""
});

/** 修复后的搜索学生逻辑 */
const searchStudents = debounce(async (query: string) => {
  if (!query) return;
  searchLoading.value = true;
  const res = await searchUserByName(query);
  studentOptions.value = Array.isArray(res) ? res : (res as any).data || [];
  searchLoading.value = false;
}, 300);

/** 修复后的搜索老师逻辑 */
async function searchTeachers(query: string) {
  if (!query) {
    teacherOptions.value = [];
    return;
  }

  searchLoading.value = true;
  try {
    const res = await searchUserByName(query);
    teacherOptions.value = Array.isArray(res) ? res : (res as any).data || [];
  } catch (error) {
    console.error("搜索老师失败:", error);
    teacherOptions.value = [];
  } finally {
    searchLoading.value = false;
  }
}

async function handleSubmit() {
  // 1. 基础校验
  if (form.participants.length === 0 || !uploadFile.value || !form.cert_no) {
    return message("请完善获奖信息并上传证书", { type: "warning" });
  }

  submitLoading.value = true;
  try {
    // === 第一阶段：创建证书 ===
    const certFormData = new FormData();
    certFormData.append("cert_no", form.cert_no);
    certFormData.append("image_uri", uploadFile.value);

    message("正在上传证书...", { type: "info" });
    const certRes = await createCert(certFormData);
    const certId = certRes.id; // 获取后端返回的证书 UUID

    if (!certId) throw new Error("证书创建失败，未获取到UUID");

    // === 第二阶段：创建获奖记录 ===
    // 注意：获奖接口如果不需要文件上传，可以直接传 JSON 对象
    // 如果后端依然要求 FormData 格式：
    const awardFormData = new FormData();
    awardFormData.append("competition", String(form.competition));
    awardFormData.append("award_level", form.award_level);
    awardFormData.append("award_date", form.award_date);
    awardFormData.append("certificate", certId); // 传入刚刚拿到的证书 UUID

    form.participants.forEach(id => awardFormData.append("participants", id));
    form.instructors.forEach(id => awardFormData.append("instructors", id));

    await createAwardWithCert(awardFormData);

    // === 第三阶段：收尾 ===
    message("获奖及证书录入成功", { type: "success" });
    dialogVisible.value = false;
    onSearch(); // 刷新列表
    resetForm(); // 重置表单
  } catch (e) {
    console.error("提交失败详情:", e);
    message(`提交失败: ${e.message || "请检查网络或参数"}`, { type: "error" });
  } finally {
    submitLoading.value = false;
  }
}

/** 表单重置函数 */
function resetForm() {
  Object.assign(form, {
    competition: null,
    participants: [],
    instructors: [],
    award_level: "",
    award_date: "",
    cert_no: ""
  });
  uploadFile.value = null;
}

async function onSearch() {
  loading.value = true;
  try {
    const res = await getAwardList();
    console.log("获奖列表原始数据:", res);
    // 确保赋值的是数组
    dataList.value = Array.isArray(res) ? res : (res as any).data || [];
    if (dataList.value.length === 0) {
      console.warn("注意：后端返回了空数组");
    }
  } catch (error) {
    console.error("加载列表失败:", error);
    message("无法获取获奖列表", { type: "error" });
  } finally {
    // 必须确保这一行执行，否则页面永远是 loading 状态
    loading.value = false;
  }
}
/** 删除获奖记录逻辑 */
async function handleDelete(row: any) {
  // 1. 弹出二次确认框，防止误删
  const confirm = await ElMessageBox.confirm(
    `确认要删除该获奖记录吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  ).catch(() => null);

  if (!confirm) return;

  try {
    // 2. 调用 API 删除（row.id 是 UUID 字符串）
    await deleteAward(row.id);
    message("删除成功", { type: "success" });
    // 3. 重新加载列表数据
    onSearch();
  } catch (e) {
    message("删除失败", { type: "error" });
  }
}

const handleFileChange = file => {
  uploadFile.value = file.raw;
};

onMounted(async () => {
  // 1. 必须调用这个函数，才会去请求“获奖列表”接口渲染表格
  onSearch();
  // 2. 获取竞赛下拉框数据
  try {
    const compRes = await getCompList();
    competitionOptions.value = Array.isArray(compRes)
      ? compRes
      : (compRes as any).data || [];
  } catch (error) {
    console.error("加载竞赛列表失败", error);
  }
});
</script>
