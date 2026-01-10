<template>
  <el-dialog
    v-model="visible"
    title="团队详情及审批"
    width="800px"
    destroy-on-close
  >
    <div v-loading="loading" class="max-h-[70vh] overflow-y-auto px-2">
      <el-descriptions :column="2" border title="基础信息">
        <el-descriptions-item label="团队名称">
          <span class="font-bold text-blue-600">{{ form.name }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="所属赛事">
          {{ form.event_name }}
        </el-descriptions-item>
        <el-descriptions-item label="队长信息">
          <span v-if="form.leader_real_name">
            {{ form.leader_real_name }}
            <span class="text-gray-400 text-xs">({{ form.leader_name }})</span>
          </span>
          <span v-else>{{ form.leader }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="当前状态">
          <el-tag :type="statusTagType" effect="dark">{{
            form.status_display
          }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div class="grid grid-cols-1 gap-4 mt-6">
        <section>
          <h4 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
            <IconifyIconOffline
              icon="ri:user-star-line"
              class="text-orange-500"
            />
            指导老师
          </h4>
          <el-table :data="form.teacher_details" size="small" border stripe>
            <el-table-column prop="user_id" label="工号" width="120" />
            <el-table-column prop="real_name" label="姓名" width="120" />
            <el-table-column
              prop="department"
              label="学院/部门"
              show-overflow-tooltip
            />
          </el-table>
        </section>

        <section>
          <h4 class="mb-2 flex items-center gap-2 font-bold text-gray-700">
            <IconifyIconOffline icon="ri:group-line" class="text-green-500" />
            团队成员
          </h4>
          <el-table :data="form.member_details" size="small" border stripe>
            <el-table-column prop="user_id" label="学号" width="120" />
            <el-table-column prop="real_name" label="姓名" width="120" />
            <el-table-column
              prop="department"
              label="专业班级"
              show-overflow-tooltip
            />
          </el-table>
        </section>
      </div>

      <div
        class="mt-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold">作品附件：</span>
            <el-link
              v-if="form.works"
              :href="form.works"
              target="_blank"
              type="primary"
            >
              <IconifyIconOffline icon="ep:document" /> 点击下载作品
            </el-link>
            <span v-else class="text-gray-400">未上传</span>
          </div>
          <div v-if="form.attachment" class="flex items-center gap-2">
            <span class="font-bold">证书文件：</span>
            <el-link :href="form.attachment" target="_blank" type="warning">
              <IconifyIconOffline icon="ri:medal-line" /> 查看扫描件
            </el-link>
          </div>
        </div>
      </div>

      <div
        v-if="form.applied_award_level || form.temp_cert_no"
        class="mt-4 p-4 bg-orange-50 rounded border border-orange-200"
      >
        <h4 class="text-orange-800 font-bold mb-2">获奖预览</h4>
        <div class="text-sm space-y-1">
          <p>
            获奖等级：<el-tag size="small" type="warning">{{
              formatAwardLevel(form.applied_award_level)
            }}</el-tag>
          </p>
          <p>
            证书编号：<code class="text-blue-700">{{ form.temp_cert_no }}</code>
          </p>
        </div>
      </div>

      <el-divider content-position="left">审批决策</el-divider>
      <div class="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-4">
        <div v-if="form.status === 'submitted'" class="flex flex-col gap-4">
          <el-input
            v-model="reviewReason"
            type="textarea"
            placeholder="请输入审批备注或驳回原因 (可选)"
            :rows="2"
          />
          <div class="flex justify-center gap-4">
            <el-button type="danger" @click="handleReviewShortlist('reject')"
              >驳回申请</el-button
            >
            <el-button type="primary" @click="handleReviewShortlist('approve')"
              >通过初筛</el-button
            >
          </div>
        </div>

        <div
          v-else-if="form.status === 'shortlisted'"
          class="flex flex-col items-center gap-4"
        >
          <p class="text-sm text-blue-700">
            该团队已通过初筛，请确认为其颁发奖项或结束其流程：
          </p>
          <div class="flex justify-center gap-4">
            <el-button type="info" @click="handleReviewAward('finish')"
              >不予获奖 (结束)</el-button
            >
            <el-button type="success" @click="handleReviewAward('award')"
              >确认为获奖团队</el-button
            >
          </div>
        </div>

        <div v-else class="text-center text-gray-500 py-2">
          <p class="mb-3">
            当前状态
            <el-tag size="small">{{ form.status_display }}</el-tag> 无需审批操作
          </p>
          <el-popconfirm
            title="确定要将该团队重置为草稿状态吗？这通常用于修正录入错误。"
            confirm-button-text="确定重置"
            cancel-button-text="取消"
            width="250"
            @confirm="handleResetToDraft"
          >
            <template #reference>
              <el-button
                v-if="form.status !== 'draft'"
                type="warning"
                size="small"
                plain
              >
                重置为草稿状态
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  getTeamDetail,
  reviewShortlist,
  reviewAward,
  resetTeamToDraft
} from "@/api/team";
import { message } from "@/utils/message";

const emit = defineEmits(["refresh"]);
const visible = ref(false);
const loading = ref(false);
const form = ref<any>({});
const reviewReason = ref(""); // 审批备注

// --- 状态与格式化 ---
const statusTagType = computed(() => {
  const map: any = {
    draft: "info",
    submitted: "warning",
    shortlisted: "primary",
    awarded: "success",
    rejected: "danger",
    finished: "info"
  };
  return map[form.value.status] || "info";
});

const formatAwardLevel = (level: string) => {
  const map: any = { first: "一等奖", second: "二等奖", third: "三等奖" };
  return map[level] || "未录入";
};

// --- 数据加载逻辑 ---
const open = async (teamData: any) => {
  visible.value = true;
  loading.value = true;
  // 核心：强制解析出纯数字 ID
  const teamId =
    teamData && typeof teamData === "object" ? teamData.id : teamData;
  try {
    const res = await getTeamDetail(teamId);
    form.value = {
      ...res,
      // 队长信息从 leader_detail.profile 中取
      leader_real_name: res.leader_detail?.profile?.real_name,
      // 教师和成员详情直接映射到表格需要的数据格式
      teacher_details:
        res.teachers_detail?.map(t => ({
          user_id: t.user_id,
          real_name: t.profile?.real_name,
          department: t.profile?.department
        })) || [],
      member_details:
        res.members_detail?.map(m => ({
          user_id: m.user_id,
          real_name: m.profile?.real_name,
          department:
            m.profile?.clazz || m.profile?.major || m.profile?.department
        })) || []
    };
  } catch (error) {
    message("详情获取失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

// --- 审批操作 ---

// 初筛审批 (通过/驳回)
const handleReviewShortlist = async (action: "approve" | "reject") => {
  try {
    loading.value = true;
    await reviewShortlist(form.value.id, {
      action,
      reason: reviewReason.value
    });
    message(action === "approve" ? "已通过初筛" : "已驳回申请", {
      type: "success"
    });
    emit("refresh"); // 通知父组件刷新列表
    visible.value = false;
  } catch (e) {
    message("操作失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

// 获奖审批 (确认获奖/不予获奖)
const handleReviewAward = async (action: "award" | "finish") => {
  try {
    loading.value = true;
    await reviewAward(form.value.id, { action });
    message(action === "award" ? "已确认获奖" : "流程已结束", {
      type: "success"
    });
    emit("refresh");
    visible.value = false;
  } catch (e) {
    message("操作失败", { type: "error" });
  } finally {
    loading.value = false;
  }
};

// 重置团队状态逻辑
const handleResetToDraft = async () => {
  try {
    loading.value = true;
    const res = await resetTeamToDraft(form.value.id);
    // 根据你后端的 Response 返回信息进行提示
    message(res.detail || "团队已重置为草稿状态", { type: "success" });
    emit("refresh"); // 刷新父级列表
    visible.value = false; // 关闭弹窗
  } catch (e) {
    console.error(e);
    message("重置失败，请联系系统管理员", { type: "error" });
  } finally {
    loading.value = false;
  }
};

defineExpose({ open });
</script>

<style scoped>
:deep(.el-descriptions__label) {
  width: 130px;
  font-weight: 500;
  color: #64748b;
  background-color: #f8fafc;
}
</style>
